/*
 * Redpacket.js - 红包系统模块
 * YEssential 子模块
 */

module.exports = {
    init() {
        const _conf    = globalThis.conf;
        const _lang    = globalThis.lang;
        const _info    = globalThis.info;
        const _dp      = globalThis.datapath;
        const _eco     = globalThis.economyCfg;
        const _Economy = globalThis.Economy;
        const _Notify  = globalThis.EconomyNotify; // 离线消息队列

        function L(key, fallback) {
            const v = _lang.get(key);
            return (v && v !== key) ? v : (fallback || key);
        }

        const Money = {
            get:        pl         => _Economy.get(pl),
            add:        (pl, n)    => _Economy.execute(pl,   "add",    n),
            reduce:     (pl, n)    => _Economy.execute(pl,   "reduce", n),
            addOffline: (name, n)  => _Economy.execute(name, "add",    n),
        };

        // ════════════════════════════════════════════════════════
        // 数据层
        // ════════════════════════════════════════════════════════
        const DB = {
            path: _dp + "Redpacketdata/Redpacket.json",
            data: { nextId: 1, packets: {} },

            load() {
                try {
                    const raw = file.readFrom(this.path);
                    if (raw) this.data = JSON.parse(raw);
                    if (!this.data.packets) this.data.packets = {};
                    if (!this.data.nextId)  this.data.nextId  = 1;
                } catch (e) {
                    logger.error("[红包] 数据加载失败: " + e);
                }
            },

            save() {
                try {
                    file.writeTo(this.path, JSON.stringify(this.data, null, 2));
                } catch (e) {
                    logger.error("[红包] 数据保存失败: " + e);
                }
            },

            getPacket(id)         { return this.data.packets[id]; },
            setPacket(id, packet) { this.data.packets[id] = packet; this.save(); },
            delPacket(id)         { delete this.data.packets[id];   this.save(); },
            allPackets()          { return this.data.packets; },

            nextId() {
                const id = this.data.nextId;
                this.data.nextId++;
                this.save();
                return id;
            }
        };

        DB.load();
        globalThis.redpacketData = DB;

        // ── 过期队列（启动时从文件恢复） ────────────────────────
        const expiryQueue = [];
        Object.values(DB.allPackets()).forEach(p => {
            if (p.remaining > 0)
                expiryQueue.push({ id: p.id, expireAt: p.expireAt });
        });
        expiryQueue.sort((a, b) => a.expireAt - b.expireAt);

        let sending = false;

        // ════════════════════════════════════════════════════════
        // 随机金额（二倍均值法）
        // ════════════════════════════════════════════════════════
        function calcRandom(remaining, remainingAmount) {
            if (remaining === 1) return remainingAmount;
            const safeMax = remainingAmount - (remaining - 1);
            if (safeMax <= 1) return 1;
            const maxAmt = Math.min(Math.floor((remainingAmount / remaining) * 2), safeMax);
            return Math.max(1, Math.floor(Math.random() * maxAmt) + 1);
        }

        // ════════════════════════════════════════════════════════
        // 过期/退款处理
        // ════════════════════════════════════════════════════════
        function expirePacket(packet) {
            if (!packet) return;

            if (packet.remainingAmount > 0) {
                const refund    = packet.remainingAmount;
                const refundMsg = _Notify.fmt.system("add", refund, _eco.coinName,
                    L("rp.expired.reason", `红包 #${packet.id} 过期退还`)
                        .replace("${id}", packet.id));
                // _Notify.send 自动处理在线直发 / 离线入队，退款走 Economy 离线队列
                _Notify.send(packet.sender, refundMsg);
                Money.addOffline(packet.sender, refund);
            }

            DB.delPacket(packet.id);
        }

        // ════════════════════════════════════════════════════════
        // 发红包
        // ════════════════════════════════════════════════════════
        function cmdSend(pl, amount, count, targetPlayer, message, packetType) {
            packetType = packetType || "random";
            if (typeof targetPlayer === "string" &&
                (targetPlayer === "random" || targetPlayer === "average")) {
                packetType = targetPlayer; targetPlayer = ""; message = "";
            }
            if (typeof message === "string" &&
                (message === "random" || message === "average")) {
                packetType = message; message = "";
            }

            const cfg = _conf.get("RedPacket");
            if (!cfg || !cfg.EnabledModule)
                return pl.tell(_info + L("module.no.Enabled", "该模块未启用"));
            if (sending)
                return pl.tell(_info + L("rp.send.duplicate", "发送中，请稍候"));
            if (typeof amount !== "number" || typeof count !== "number" ||
                isNaN(amount) || isNaN(count))
                return pl.tell(_info + L("rp.send.param.error", "参数必须为数字"));

            const { maxAmount, maxCount, minAmount } = cfg;

            if (amount < minAmount || amount > maxAmount)
                return pl.tell(_info +
                    L("rp.send.amount.range", `总金额需在 ${minAmount}~${maxAmount} 之间`)
                    .replace("${min}", minAmount).replace("${max}", maxAmount));

            if (count < 1 || count > maxCount)
                return pl.tell(_info +
                    L("rp.send.count.range", `个数需在 1~${maxCount} 之间`)
                    .replace("${max}", maxCount));

            if (amount < count)
                return pl.tell(_info +
                    `§c总金额(${amount})不能少于红包个数(${count})，每包至少 1 ${_eco.coinName}！`);

            const balance = Money.get(pl);
            if (balance === null || balance === undefined || balance < amount)
                return pl.tell(_info + L("rp.send.no.balance", "余额不足"));

            // 扣款 + 通知
            Money.reduce(pl, amount);
            _Notify.send(pl, _Notify.fmt.system("reduce", amount, _eco.coinName, L("rp.send.deduct.reason", "发送红包")));

            sending = true;
            const id         = DB.nextId();
            const isSpecific = !!(targetPlayer && targetPlayer.trim());
            const packet = {
                id,
                sender:          pl.realName,
                amount,
                count,
                remaining:       count,
                remainingAmount: amount,
                recipients:      [],
                targetType:      isSpecific ? "specific" : "all",
                targetPlayer:    (targetPlayer || "").trim(),
                message:         message ||
                                 L("rp.default.message", `${pl.realName} 发来一个红包`)
                                 .replace("${sender}", pl.realName),
                packetType:      packetType === "average" ? "average" : "random",
                createdAt:       Date.now(),
                expireAt:        Date.now() + (cfg.expireTime * 1000)
            };

            DB.setPacket(id, packet);
            expiryQueue.push({ id, expireAt: packet.expireAt });
            expiryQueue.sort((a, b) => a.expireAt - b.expireAt);
            sending = false;

            const typeName = L(
                packet.packetType === "random" ? "rp.type.random.short" : "rp.type.average.short",
                packet.packetType === "random" ? "拼手气" : "普通"
            );

            if (isSpecific) {
                const tgt = mc.getPlayer(packet.targetPlayer);
                if (tgt) {
                    tgt.tell(_info +
                        L("rp.send.notify.target", `${pl.realName} 给你发了一个${typeName}红包！`)
                        .replace("${sender}", pl.realName)
                        .replace("${type}",   typeName));
                }
                pl.tell(_info +
                    L("rp.send.success.specific",
                      `已向 ${packet.targetPlayer} 发送 ${typeName}红包：${amount} ${_eco.coinName} × ${count}`)
                    .replace("${player}", packet.targetPlayer)
                    .replace("${type}",   typeName)
                    .replace("${amount}", amount)
                    .replace("${count}",  count));
            } else {
                mc.broadcast(_info +
                    L("rp.send.broadcast", `${pl.realName} 发了一个${typeName}红包，快来抢！`)
                    .replace("${sender}", pl.realName)
                    .replace("${type}",   typeName));
                pl.tell(_info +
                    L("rp.send.success.all", `${typeName}红包发送成功：${amount} ${_eco.coinName} × ${count}`)
                    .replace("${type}",   typeName)
                    .replace("${amount}", amount)
                    .replace("${count}",  count));
            }
        }

        // ════════════════════════════════════════════════════════
        // 领红包
        // ════════════════════════════════════════════════════════
        function cmdOpen(pl) {
            const now       = Date.now();
            // 快照防止遍历时删除元素导致跳过
            const allPkts   = Object.values(DB.allPackets());
            const available = [];

            for (const p of allPkts) {
                if (p.expireAt <= now)                       { expirePacket(p); continue; }
                if (p.remainingAmount < p.remaining)         { expirePacket(p); continue; }
                if (p.remaining <= 0)                        continue;
                if (p.recipients.includes(pl.realName))      continue;
                if (p.targetType === "specific" &&
                    p.targetPlayer.toLowerCase() !== pl.realName.toLowerCase()) continue;
                available.push(p);
            }

            if (available.length === 0)
                return pl.tell(_info + L("rp.open.none", "当前没有可领取的红包"));

            available.sort((a, b) => a.createdAt - b.createdAt);
            const packet = available[0];

            let amount = packet.packetType === "average"
                ? Math.max(1, Math.floor(packet.remainingAmount / packet.remaining))
                : calcRandom(packet.remaining, packet.remainingAmount);

            amount = Math.max(1, Math.min(amount, packet.remainingAmount));

            packet.remaining--;
            packet.remainingAmount -= amount;
            packet.recipients.push(pl.realName);

            if (packet.remaining <= 0) {
                DB.delPacket(packet.id);
            } else {
                DB.setPacket(packet.id, packet);
            }

            Money.add(pl, amount);

            const typeName = L(
                packet.packetType === "random" ? "rp.type.random.short" : "rp.type.average.short",
                packet.packetType === "random" ? "拼手气" : "普通"
            );

            pl.tell(_info +
                L("rp.open.success",
                  `恭喜你领取到 ${packet.sender} 的${typeName}红包，获得 ${amount} ${_eco.coinName}！`)
                .replace("${sender}", packet.sender)
                .replace("${type}",   typeName)
                .replace("${amount}", amount)
                .replace("${coin}",   _eco.coinName));

            const sender = mc.getPlayer(packet.sender);
            if (sender && sender.realName !== pl.realName) {
                sender.tell(_info +
                    L("rp.open.notify.sender", `${pl.realName} 领取了你的红包，获得 ${amount} ${_eco.coinName}`)
                    .replace("${player}", pl.realName)
                    .replace("${amount}", amount)
                    .replace("${coin}",   _eco.coinName));
            }
        }

        // ════════════════════════════════════════════════════════
        // 红包列表 GUI
        // ════════════════════════════════════════════════════════
        function cmdList(pl) {
            const now     = Date.now();
            const allPkts = Object.values(DB.allPackets()); // 快照
            const form    = mc.newSimpleForm()
                .setTitle(L("rp.list.title",    "可领红包"))
                .setContent(L("rp.list.content", "点击红包立即领取"));

            let hasAny = false;

            for (const p of allPkts) {
                if (p.expireAt <= now)                { expirePacket(p); continue; }
                if (p.remainingAmount < p.remaining)  { expirePacket(p); continue; }
                if (p.remaining <= 0)                 continue;
                if (p.recipients.includes(pl.realName)) continue;
                if (p.targetType === "specific" &&
                    p.targetPlayer.toLowerCase() !== pl.realName.toLowerCase()) continue;

                const sec   = Math.ceil((p.expireAt - now) / 1000);
                const tName = L(
                    p.packetType === "random" ? "rp.type.random.colored" : "rp.type.average.colored",
                    p.packetType === "random" ? "§c拼手气" : "§a普通"
                );
                form.addButton(
                    L("rp.list.button",
                      `${tName} §f${p.sender}的红包\n§7总额:§f${p.amount} 剩余:§a${p.remaining}/${p.count} 到期:§e${sec}s`)
                    .replace("${type}",      tName)
                    .replace("${sender}",    p.sender)
                    .replace("${amount}",    p.amount)
                    .replace("${remaining}", p.remaining)
                    .replace("${count}",     p.count)
                    .replace("${expire}",    sec)
                );
                hasAny = true;
            }

            if (!hasAny) {
                form.setContent(L("rp.open.none", "暂无可领红包"));
                form.addButton(L("rp.list.close", "关闭"));
                pl.sendForm(form, () => {});
                return;
            }

            pl.sendForm(form, (player, id) => {
                if (id != null) cmdOpen(pl);
            });
        }

        // ════════════════════════════════════════════════════════
        // 历史记录
        // ════════════════════════════════════════════════════════
        function cmdHistory(pl) {
            const history = Object.values(DB.allPackets()).filter(p =>
                p.sender === pl.realName || p.recipients.includes(pl.realName)
            );

            if (history.length === 0)
                return pl.tell(_info + L("rp.history.empty", "暂无红包历史"));

            history.sort((a, b) => b.createdAt - a.createdAt);

            const form = mc.newSimpleForm()
                .setTitle(L("rp.history.title",    "红包历史"))
                .setContent(L("rp.history.content", "最近 10 条"));

            history.slice(0, 10).forEach(p => {
                const isSender  = p.sender === pl.realName;
                const role      = L(isSender ? "rp.role.sender" : "rp.role.receiver", isSender ? "已发" : "已领");
                const typeTag   = L(p.packetType === "random" ? "rp.type.random.tag" : "rp.type.average.tag",
                                    p.packetType === "random" ? "[拼手气]" : "[普通]");
                const status    = L(p.remaining > 0 ? "rp.history.status.active" : "rp.history.status.ended",
                                    p.remaining > 0 ? "§a进行中" : "§7已结束");
                const disbursed = p.amount - Math.max(0, p.remainingAmount);
                const detail    = isSender
                    ? L("rp.history.sent.amount", `已派发: ${disbursed}`).replace("${amount}", disbursed)
                    : L("rp.history.recv.amount", `已领取`).replace("${amount}", disbursed);

                form.addButton(
                    `§l${role}${typeTag} §e${p.sender}的红包\n` +
                    `§7总额:§f${p.amount}  状态:${status}\n§7${detail}`
                );
            });

            pl.sendForm(form, (player, id) => {
                if (id != null) showDetail(pl, history[id]);
            });
        }

        // ── 红包详情 ───────────────────────────────────────────
        function showDetail(pl, p) {
            const coin = _eco.coinName;
            const form = mc.newCustomForm().setTitle(L("rp.detail.title", "红包详情"));

            form.addLabel(L("rp.detail.sender",      `发送者: ${p.sender}`).replace("${sender}", p.sender));
            form.addLabel(L("rp.detail.packet.type", `类型: ...`).replace("${type}",
                L(p.packetType === "random" ? "rp.random.packet" : "rp.average.packet", p.packetType)));
            form.addLabel(L("rp.detail.target.type", `范围: ...`).replace("${type}",
                L(p.targetType === "all" ? "rp.target.all" : "rp.target.specific", p.targetType)));
            if (p.targetType === "specific")
                form.addLabel(L("rp.detail.target.player", `指定玩家: ${p.targetPlayer}`)
                    .replace("${player}", p.targetPlayer));
            form.addLabel(L("rp.detail.amount",           `总金额: ${p.amount} ${coin}`)
                .replace("${amount}", p.amount).replace("${coin}", coin));
            form.addLabel(L("rp.detail.count",            `总个数: ${p.count}`).replace("${count}", p.count));
            form.addLabel(L("rp.detail.remaining.amount", `剩余金额: ${Math.max(0, p.remainingAmount)} ${coin}`)
                .replace("${amount}", Math.max(0, p.remainingAmount)).replace("${coin}", coin));
            form.addLabel(L("rp.detail.remaining.count",  `剩余个数: ${p.remaining}`)
                .replace("${count}", p.remaining));
            form.addLabel(L("rp.detail.message", `留言: ${p.message}`).replace("${msg}", p.message));
            form.addLabel(L("rp.detail.expire",  `到期: ...`)
                .replace("${time}", new Date(p.expireAt).toLocaleString()));

            if (p.recipients.length > 0) {
                form.addLabel(L("rp.detail.recipients", "已领取玩家："));
                p.recipients.forEach(name =>
                    form.addLabel(L("rp.detail.recipient.item", `  · ${name}`).replace("${name}", name))
                );
            }

            pl.sendForm(form, () => { pl.runcmd("moneygui"); });
        }

        // ════════════════════════════════════════════════════════
        // 注册指令  /rp
        // ════════════════════════════════════════════════════════
        const rpCmd = mc.newCommand("rp", "红包功能", PermType.Any);
        rpCmd.setEnum("sub",   ["send", "open", "list", "history"]);
        rpCmd.setEnum("ptype", ["random", "average"]);

        rpCmd.mandatory("sub",   ParamType.Enum, "sub");
        rpCmd.optional("amount", ParamType.Int);
        rpCmd.optional("count",  ParamType.Int);
        rpCmd.optional("player", ParamType.String);
        rpCmd.optional("msg",    ParamType.String);
        rpCmd.optional("ptype",  ParamType.Enum, "ptype");

        rpCmd.overload(["sub", "amount", "count", "player", "msg", "ptype"]);
        rpCmd.overload(["sub", "amount", "count", "player", "msg"]);
        rpCmd.overload(["sub", "amount", "count"]);
        rpCmd.overload(["sub"]);

        rpCmd.setCallback((cmd, ori, out, res) => {
            const pl = ori.player;
            if (!pl) return;
            if (!_conf.get("RedPacket")?.EnabledModule)
                return pl.tell(_info + L("module.no.Enabled", "该模块未启用"));
            switch (res.sub) {
                case "send":    cmdSend(pl, res.amount, res.count, res.player, res.msg, res.ptype); break;
                case "open":    cmdOpen(pl);    break;
                case "list":    cmdList(pl);    break;
                case "history": cmdHistory(pl); break;
            }
        });
        rpCmd.setup();

        // ════════════════════════════════════════════════════════
        // 帮助指令  /rphelp
        // ════════════════════════════════════════════════════════
        setTimeout(() => {
            mc.listen("onServerStarted", () => {
                if (!_conf.get("RedPacket")?.EnabledModule) return;
                mc.regPlayerCmd("rphelp", L("rp.all.help", "红包帮助"), pl => {
                    const helpKeys   = ["rp.send.packet","rp.open.packet","rp.help.view","rp.help.history.btn","rp.help.types.btn"];
                    const detailKeys = ["rp.help.send.detail","rp.help.open.detail","rp.help.list.detail","rp.help.history.detail","rp.help.type.detail"];

                    const f = mc.newSimpleForm()
                        .setTitle(L("rp.all.help", "红包帮助"))
                        .setContent(L("rp.help.content", ""));
                    helpKeys.forEach(k => f.addButton(L(k, k)));

                    pl.sendForm(f, (player, id) => {
                        if (id == null) return;
                        const df = mc.newCustomForm()
                            .setTitle(L("rp.help.detail.title", "详情"))
                            .addLabel(L(detailKeys[id], detailKeys[id]));
                        pl.sendForm(df, () => {});
                    });
                });
            });
        }, 2000);

        // ════════════════════════════════════════════════════════
        // 过期检测（每 30 秒）
        // ════════════════════════════════════════════════════════
        setInterval(() => {
            const now     = Date.now();
            // 先处理 expiryQueue
            while (expiryQueue.length > 0 && expiryQueue[0].expireAt <= now) {
                const item = expiryQueue.shift();
                const p    = DB.getPacket(item.id);
                if (p && p.expireAt <= now) expirePacket(p);
            }
            // 快照扫描，清理损坏红包（不在队列里的漏网之鱼）
            Object.values(DB.allPackets()).forEach(p => {
                if (p.remaining > 0 && p.remainingAmount < p.remaining)
                    expirePacket(p);
            });
        }, 30 * 1000);
    }
};
