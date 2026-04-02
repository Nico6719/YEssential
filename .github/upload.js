const axios = require('axios');
const cheerio = require('cheerio');
const FormData = require('form-data');
const fs = require('fs');
const qs = require('qs');

const config = {
    targetUrl: process.env.MINEBBS_TARGET_URL,
    cookies: process.env.MINEBBS_COOKIE,
    filePath: process.env.MINEBBS_FILE_PATH,
    version: process.env.MINEBBS_VERSION,
    updateTitle: process.env.MINEBBS_UPDATE_TITLE || '自动同步更新',
    changeLog: process.env.MINEBBS_CHANGE_LOG || '来自 GitHub Action 的自动发布。',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
};

async function run() {
    try {
        console.log(`[1/3] 正在访问资源页面...`);
        const pageRes = await axios.get(config.targetUrl, {
            headers: { 'Cookie': config.cookies, 'User-Agent': config.userAgent }
        });

        const $ = cheerio.load(pageRes.data);
        const attachmentHash = $('input[name="attachment_hash"]').val();
        const xfToken = $('input[name="_xfToken"]').val() || $('html').data('csrf');
        const resourceId = config.targetUrl.match(/\/resources\/.*?(?:[./])(\d+)/)[1];

        if (!attachmentHash || !xfToken) throw new Error('未能获取凭证，请检查 MINEBBS_COOKIE 是否过期。');

        console.log(`[2/3] 正在上传文件: ${config.filePath}`);
        const uploadUrl = `https://www.minebbs.com/attachments/upload?type=resource_version&context[resource_id]=${resourceId}&hash=${attachmentHash}`;
        const form = new FormData();
        form.append('upload', fs.createReadStream(config.filePath));
        form.append('_xfToken', xfToken);
        form.append('_xfResponseType', 'json');

        const uploadRes = await axios.post(uploadUrl, form, {
            headers: { ...form.getHeaders(), 'Cookie': config.cookies, 'User-Agent': config.userAgent }
        });

        if (uploadRes.data.status !== 'ok') throw new Error('文件上传失败: ' + JSON.stringify(uploadRes.data));
        console.log(`✅ 上传成功，ID: ${uploadRes.data.attachment.attachment_id}`);

        console.log(`[3/3] 正在提交发布表单...`);
        const combinedHash = JSON.stringify({
            type: "resource_version",
            context: { resource_id: parseInt(resourceId) },
            hash: attachmentHash
        });

        const postData = {
            'new_version': '1',
            'version_string': config.version,
            'version_type': 'local',
            'version_attachment_hash': attachmentHash,
            'version_attachment_hash_combined': combinedHash,
            'new_update': '1',
            'update_title': config.updateTitle,
            'update_message_html': `<p>${config.changeLog.replace(/\n/g, '<br>')}</p>`,
            '_xfToken': xfToken,
            '_xfResponseType': 'json',
            '_xfWithData': '1',
            '_xfRequestUri': config.targetUrl.replace('https://www.minebbs.com', '')
        };

        const saveRes = await axios.post(config.targetUrl, qs.stringify(postData), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': config.cookies,
                'User-Agent': config.userAgent,
                'X-Requested-With': 'XMLHttpRequest'
            },
            maxRedirects: 0,
            validateStatus: (status) => status >= 200 && status < 400
        });

        if (saveRes.data.status === 'ok' || saveRes.status === 302) {
            console.log('🎉 MineBBS 资源更新成功！');
        } else {
            console.error('❌ 发布失败:', saveRes.data.errors || saveRes.data);
            process.exit(1);
        }
    } catch (e) {
        console.error('💥 运行出错:', e.message);
        process.exit(1);
    }
}

run();
