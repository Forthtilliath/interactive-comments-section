const container = document.querySelector('.container');

const templates = {
    comment: document.querySelector('#template .comment'),
    reply: document.querySelector('#template .reply'),
    reply_form: document.querySelector('#template .reply_form'),
};


(async () => {
    const data = await loadData();
    const { currentUser, comments } = data;

    comments.forEach(createComment);
})();

/** Charge les données json */
async function loadData() {
    return await fetch('./data.json').then((res) => res.json());
}

function createComment(comment) {
    const div = templates.comment.cloneNode(true);
    div.setAttribute('data-id', comment.id);
    
    div.innerHTML = div.innerHTML
        .replaceAll('{{id}}', comment.id)
        .replaceAll('{{likes}}', comment.score)
        .replaceAll('{{image_webp}}', comment.user.image.webp)
        .replaceAll('{{image_png}}', comment.user.image.png)
        .replaceAll('{{username}}', comment.user.username)
        .replaceAll('{{date}}', comment.createdAt)
        .replaceAll('{{content}}', comment.content);
    
    comment.replies.forEach(createReply);

    container.appendChild(div);
}

function createReply(reply) {
    const div = templates.reply.cloneNode(true);
    div.setAttribute('data-id', reply.id);
    
    div.innerHTML = div.innerHTML
        .replaceAll('{{id}}', reply.id)
        .replaceAll('{{likes}}', reply.score)
        .replaceAll('{{image_webp}}', reply.user.image.webp)
        .replaceAll('{{image_png}}', reply.user.image.png)
        .replaceAll('{{username}}', reply.user.username)
        .replaceAll('{{date}}', reply.createdAt)
        .replaceAll('{{replying}}', reply.replyingTo)
        .replaceAll('{{content}}', reply.content);

    container.appendChild(div);

}
