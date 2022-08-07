export function fetchCommentAction ({ id, list }, target) {
  const post = target.find(v => v.id === id)
        
  if (post.comment_list) post.comment_list.push(...list)
  else post.comment_list = list
}

export function addCommentAction ({ id, list }, target, callback?) {
  debugger
  const post = target.find(v => v.id === id)

  post.comment_list = list

  if (callback) callback()
}

export function updateCommentAction ({ postId, id, list }, target) {

}

export function deleteCommentAction ({ postId, id, list }, target) {

}