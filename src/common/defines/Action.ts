export function updatePostAction (data, target, callback?) {
  let idx = target.findIndex(v => v.id === data.id)

  target[idx] = { ...data.post }

  if (callback) callback()
}

export function deletePostAction (id, target, callback?) {
  if (callback) callback()
  
  return target.filter(v => v.id !== id)
}

export function fetchCommentAction ({ id, list }, target) {
  const post = target.find(v => v.id === id)
  
  if (post.comment_list) post.comment_list = [...post.comment_list, ...list]
  else post.comment_list = list

  if (post.comment_count === post.comment_list.length) post.comment_done = true
}

export function addCommentAction ({ id, comment }, target, callback?) {
  const post = target.find(v => v.id === id)

  post.comment_list = [ comment, ...post.comment_list ]
  post.comment_count += 1

  if (callback) callback()
}

export function updateCommentAction ({ postId, id, data }, target, callback?) {
  const post = target.find(v => v.id === postId)
  let comment = post.comment_list.find(v => v.id === id)

  comment.contents = data

  if (callback) callback(data)
}

export function deleteCommentAction ({ postId, id }, target, callback?) {
  const post = target.find(v => v.id === postId)

  post.comment_list = post.comment_list.filter(v => v.id !== id)
  post.comment_count -= 1

  if (callback) callback()
}

export function fetchReplyAction ({ id, commentId, postId, list }, target) {
  const post = target.find(v => v.id === postId)
  const comment = post.comment_list.find(v => v.id === commentId)

  if ("reply_list" in comment) {
    if (comment.reply_list.length > 0) {
      const reply = comment.reply_list.findIndex(v => v.id === list[0].id)
  
      if (reply >= 0) return
    }

    comment.reply_list = comment.reply_list.filter(v => "added" in v === false)
    comment.reply_list = [ ...comment.reply_list, ...list ]
  } else {
    comment.reply_list = list
  }

  if (comment.reply_count === comment.reply_list.length) comment.reply_done = true
}

export function addReplyAction ({ postId, commentId, reply }, target, callback?) {
  const post = target.find(v => v.id === postId)
  const comment = post.comment_list.find(v => v.id === commentId)
  const reply_list = comment.reply_list || []
  const _reply = {
    ...reply,
    id: `_${ reply.id }`,
    added: true,
  }

  comment.reply_list = [...reply_list, _reply]
  comment.reply_count += 1

  if (callback) callback()
}

export function updateReplyAction ({ postId, commentId, id, contents }, target, callback?) {
  const post = target.find(v => v.id === postId)
  const comment = post.comment_list.find(v => v.id === commentId)
  const reply = comment.reply_list.find(v => v.id === id)

  reply.contents = contents
  
  if (callback) callback(contents)
}

export function deleteReplyAction ({ postId, commentId, id}, target, callback?) {
  const post = target.find(v => v.id === postId)
  const comment = post.comment_list.find(v => v.id === commentId)

  comment.reply_list = comment.reply_list.filter(v => v.id !== id)
  comment.reply_count -= 1

  if (callback) callback()
}

export function toggleLikeContentAction ({ type, postId, commentId, replyId, like }, target) {
  const post = target.find(v => v.id === postId)
  const comment = commentId ? post.comment_list.find(v => v.id === commentId) : null
  const reply = comment && replyId ? comment.reply_list.find(v => v.id === replyId) : null

  switch (type) {
    case 'post':
      like === 'Y' ? post.like_count += 1 : post.like_count -= 1
      post.like_yn = like

      break
    case 'comment':
      like === 'Y' ? comment.like_count += 1 : comment.like_count -= 1
      comment.like_yn = like

      break
    case 'reply':
      like === 'Y' ? reply.like_count += 1 : reply.like_count -= 1
      reply.like_yn = like

      break
    default:
      return
  }
}

export function toggleScrapContentAction ({ id, scrap }, target) {
  const post = target.find(v => v.id === id)

  post.scrap_yn = scrap
}