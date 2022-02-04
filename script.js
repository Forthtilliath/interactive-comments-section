const container = document.querySelector('.container');

const templates = {
    comment: document.querySelector('#template .comment'),
    reply: document.querySelector('#template .reply'),
    reply_container: document.querySelector('#template .replies_container'),
    reply_to_comment: document.querySelector('#template .reply_to_comment'),
    // reply_form: document.querySelector('#template .reply_form'),
};

let currentUser;

(async () => {
    const data = await loadData();
    const { comments } = data;
    currentUser = data.currentUser;

    comments.forEach(createComment);
})();

/** Charge les données json */
async function loadData() {
    return await fetch('./data.json').then((res) => res.json());
}

/** Ajoute un commentaire au DOM */
function createComment(comment) {
    const div = templates.comment.cloneNode(true);
    setTabIndexButtons(div);
    div.setAttribute('data-id', comment.id);

    div.innerHTML = div.innerHTML
        .replaceAll('{{id}}', comment.id)
        .replaceAll('{{likes}}', comment.score)
        .replaceAll('{{image_webp}}', `srcset="${comment.user.image.webp}"`)
        .replaceAll('{{image_png}}', `src="${comment.user.image.png}"`)
        .replaceAll('{{username}}', comment.user.username)
        .replaceAll('{{date}}', comment.createdAt)
        .replaceAll('{{content}}', comment.content);

    div.querySelector('.btn_reply').addEventListener('click', (e) => handleReply(div, 'comment', getUsername(e.target)));

    container.appendChild(div);
    createReplies(comment.replies);
}

/** Ajoute les réponses de commentaire au DOM */
function createReplies(replies) {
    const reply_container = templates.reply_container.cloneNode(true);

    replies.forEach((reply) => createReply(reply_container, reply));

    container.appendChild(reply_container);
}

/** Ajoute une réponse de commentaire au DOM */
function createReply(containerReplies, comment) {
    const div = templates.reply.cloneNode(true);
    setTabIndexButtons(div);
    div.setAttribute('data-id', comment.id);
    div.classList.add('reply');

    div.innerHTML = div.innerHTML
        .replaceAll('{{id}}', comment.id)
        .replaceAll('{{likes}}', comment.score)
        .replaceAll('{{image_webp}}', `srcset="${comment.user.image.webp}"`)
        .replaceAll('{{image_png}}', `src="${comment.user.image.png}"`)
        .replaceAll('{{username}}', comment.user.username)
        .replaceAll('{{date}}', comment.createdAt)
        .replaceAll('{{replying}}', comment.replyingTo)
        .replaceAll('{{content}}', comment.content);

    div.querySelector('.btn_reply').addEventListener('click', (e) => handleReply(div, 'reply', getUsername(e.target)));

    containerReplies.appendChild(div);
}

/** Rend indexable les buttons d'un container */
function setTabIndexButtons(element) {
    const buttons = element.querySelectorAll('button');
    buttons.forEach((button) => button.setAttribute('tabindex', '0'));
}

/** Evenement pour répondre */
function handleReply(div, type, username) {
    const reply = replyTo(type, username);
    const textarea = reply.querySelector('textarea');
    const length = username.length + 1;

    div.after(reply);

    // On met le focus à la fin
    textarea.setSelectionRange(length, length);
    textarea.focus();
}

function replyTo(type, username) {
    const div = templates.reply_to_comment.cloneNode(true);
    if (type === 'reply') div.classList.add('reply');
    setTabIndexButtons(div);
    // div.setAttribute('data-id', comment.id);
    console.log(currentUser);

    div.innerHTML = div.innerHTML
        .replaceAll('{{image_webp}}', `srcset="${currentUser.image.webp}"`)
        .replaceAll('{{image_png}}', `src="${currentUser.image.png}"`)
        .replaceAll('{{replying}}', username);

    // div.querySelector('.btn_reply').addEventListener('click', () => handleReply(comment.id, div));

    // container.appendChild(div);
    return div;
}

function getUsername(button) {
    return button.closest('.comment').querySelector('.comment_username').innerText;
}
