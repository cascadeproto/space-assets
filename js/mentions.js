(async function () {
  const mentionsUrl = `https://webmention.io/api/mentions.jf2?target=${window.location.href}`;
  const response = await fetch(mentionsUrl);

  if (response.ok) {
    let mentions = await response.json();
    // Set up variables
    const likeCount = document.querySelector('#upvote-form .upvote-count').innerHTML;
    const upvoteButton = document.querySelector('#upvote-form');
    const likeCountPlural = likeCount == '1' ? '' : 's';
    let inReplyTo = [];
    let likeOf = [];
    let repostOf = [];
    let repliesHtml = '';
    let likesHtml = '';
    let repostsHtml = '';
    let mentionsHtml = '';
    // Sort mentions by type
    mentions.children.forEach(item => {
      switch (item["wm-property"]) {
        case 'in-reply-to':
          inReplyTo.push(item); break;
        case 'like-of':
          likeOf.push(item); break;
        case 'repost-of':
          repostOf.push(item); break;
      }
    });
    // Build HTML (Likes only for now)
    likeOf.forEach(mention => {
      likesHtml += `<li><a href="${mention.author.url}" target="_blank" title="${mention.author.name}"><img src="${mention.author.photo}" alt="${mention.author.name}" /></a></li>`;
    });
    if (likeOf.length) {
      mentionsHtml += `<h2>Liked by:</h2><ul class="likes">${likesHtml}<li>and <span class="like-count">${likeCount}</span> other${likeCountPlural} ${upvoteButton.outerHTML}</li></ul>`;
    } else {
      mentionsHtml += `<h2>Liked:</h2><ul class="likes"><li><span class="like-count">${likeCount}</span> time${likeCountPlural} ${upvoteButton.outerHTML}</li></ul>`;
    }
    // Insert HTML
    upvoteButton.insertAdjacentHTML('beforebegin', mentionsHtml);
    upvoteButton.remove();
    // Restart event handler on button (since it was removed + replaced)
    document.querySelector('#upvote-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const form = e.target;
      fetch(form.action, {
        method: form.method,
        body: new FormData(form),
      });
      const button = form.querySelector('button');
      button.disabled = true;
      button.style.color = "salmon";
      const upvoteCount = document.querySelector('.upvote-count');
      upvoteCount.innerHTML = `${(parseInt(upvoteCount.innerHTML.split(" ")[0]) + 1)}`;
      document.querySelector('.like-count').innerHTML = `${(parseInt(document.querySelector('.like-count').innerHTML.split(" ")[0]) + 1)}`;
    });
  }
})();
