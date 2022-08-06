export function fetchCommentAction ({ id, list }, target) {
  const post = target.find(v => v.id === id)
        
  if (post.comment_list) post.comment_list.push(list)
  else post.comment_list = list
}

export function addCommentAction ({ postId, id, list }, target) {
  
}