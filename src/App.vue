<script setup>
import Comment from './components/Comment.vue';
import { nanoid } from 'nanoid'
import { ref, watch } from 'vue';
import data from './data.json'

const currentUser = data.currentUser
const comments = ref(JSON.parse(localStorage.getItem('comments')) || data.comments)

// watch works directly on a ref
watch(comments, async (newComments, oldComments) => {
 localStorage.setItem('comments', JSON.stringify(newComments))
})

const newComment = ref("")

function handleAddComment(){
  if(newComment.value == "")
    return;
  comments.value = [...comments.value,
    {
      id: nanoid(),
      content: newComment.value,
      createdAt: new Date(),
      score: 0,
      user: currentUser,
      replies: []
    }]
  newComment.value = ""
}

function handleDelete(id, isReply, parentId){
  isReply ?
  comments.value = comments.value.map(comment => {
    return comment.id == parentId ? 
    {...comment, replies: comment.replies.filter(reply => reply.id != id )}
    : comment
  })
  :
  comments.value = comments.value.filter(comment => comment.id != id )
}


function handleReply(parentId, content, toUser){   
  comments.value = comments.value.map(comment => {
    return comment.id ==  parentId ? {...comment, replies: [...comment.replies, 
      {
        id: nanoid(),
        content: content.startsWith("@" + toUser + " ") ? content.split("@" + toUser + " ")[1] : content,
        score: 0,
        replyingTo: toUser,
        user: currentUser,
        createdAt: new Date()
      }
    ]} : comment
  })
}

function updateComment(id, content, isReply, parentId){
    isReply ? 
    comments.value = comments.value.map(comment => {
      return comment.id == parentId ? 
      {...comment, replies: comment.replies.map(reply => {
        return reply.id == id ? 
        {
          ...reply, 
          content: content.startsWith("@" + reply.replyingTo + " ") ? content.split("@" + reply.replyingTo + " ")[1] : content,
        } 
        : reply
      })}
      : comment
    }) 
    : comments.value = comments.value.map(comment => {
      return comment.id == id ? {...comment, content: content} : comment
    })
}

function handleUpvote(id, isReply, parentId){
    isReply ? 
    comments.value = comments.value.map(comment => {
      return comment.id == parentId ? 
      {...comment, replies: comment.replies.map(reply => {
        return reply.id == id ? {...reply, score: reply.score+1} : reply
      })}
      : comment
    }) 
    : comments.value = comments.value.map(comment => {
      return comment.id == id ? {...comment, score: comment.score+1} : comment
    })
  }

  function handleDownvote(id, isReply, parentId){
    isReply ? 
    comments.value = comments.value.map(comment => {
      return comment.id == parentId ? 
      {...comment, replies: comment.replies.map(reply => {
        return reply.id == id ? {...reply, score: reply.score-1} : reply
      })}
      : comment
    })
    : comments.value = comments.value.map(comment => {
      return comment.id == id ? {...comment, score: comment.score-1} : comment
    })
  }

</script>


<template>
  <div className='comments-section' v-if="comments">
    <Comment
        v-for="comment in comments"
        :key="comment.id"
        :currentUser="currentUser"
        :isReply="false"
        :comment="comment"
        :parentId="comment.id"
        :handleReply="handleReply"
        :updateComment="updateComment"
        :handleDelete="handleDelete"
        @handleUpvote="handleUpvote"
        @handleDownvote="handleDownvote"
    />
  </div>
  <div className='new-comment-section'>
    <img className='current-user-avatar' :src="currentUser.image.png" />
    <textarea rows={4} className='new-comment-input' placeholder='Add a comment...' name='new-comment' v-model="newComment"></textarea>
    <button className='new-comment-btn btn' @click="handleAddComment">Send</button>
  </div>

  <div className="attribution">
    Challenge by <a href="https://www.frontendmentor.io?ref=challenge" target="_blank">Frontend Mentor</a>. 
    Coded by <a href="https://github.com/aveandrian">aveandrian</a>.
  </div>

</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Rubik', sans-serif;
}

body, #app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.25rem;
  background-color: hsl(228, 33%, 97%);
}

.comments-section {
  width: 43.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  align-items: center;
}

.btn {
  height: 2.5rem;
  width: 6.25rem;
  border-radius: 0.313rem;
  border: none;
  color: white;
  text-transform: uppercase;
  background-color: hsl(238, 40%, 52%);
}


.delete-modal-wrapper {
  padding: 1.25rem;
  z-index: 1;
  position: absolute;
  top:0;
  left: 0;
  width: 100vw;
  height: 100vh;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(128, 128, 128, 0.322);
}

.delete-modal {
  width: 25rem;
  background-color: white;
  padding: 1.688rem;
  border-radius: 0.625rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.delete-btn-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.delete-btn-container > button {
  height: 2.5rem;
  text-transform: uppercase;
  font-weight: 500;
  border: none;
  border-radius: 0.313rem;
}

.delete-back-btn {
  color: white;
  background-color: hsl(211, 10%, 45%)
}

.delete-btn {
  background-color: hsl(358, 79%, 66%);
  color: white;
}

.delete-modal-title {
  color: hsl(212, 24%, 26%);
  font-weight: 500;
}

.delete-modal-text {
  color: hsl(211, 10%, 45%);
}

.new-comment-section {
  background-color: white;
  border-radius: 0.625rem;
  margin-top: 1.25rem;
  width: 43.75rem;
  display: flex;
  padding: 1.25rem;
  gap: 1.25rem;
}

.current-user-avatar {
  width: 2.5rem;
  height: 2.5rem;
}

.new-comment-section textarea {
  width: 100%;
  font-family: 'Rubik', sans-serif;
  font-size: 1rem;
  height: fit-content;
  padding: 0.625rem 1.25rem;
  border: 0.063rem solid hsl(223, 19%, 93%);
  border-radius: 0.625rem;
  resize: none;
}

.new-comment-section textarea:focus {
  outline: 0.063rem solid  hsl(212, 24%, 26%);
}

button:hover {
  cursor: pointer;
}

.btn:hover {
  background-color: rgb(197, 199, 240);
}

.attribution {
  margin-top: 0.63rem;
  text-align: center;
  font-size: 0.8rem;
}

@media screen and (max-width: 47rem) {
  body {
    padding: 1.25rem;
  }

  #app {
    padding: 0;
    width: 100%;
  }

  .comments-section, .new-comment-section {
    width: 100%;
  }

  .new-comment-section {
    display: grid;
    grid-template-columns: repeat(2, auto);
  }

  .new-comment-input {
    grid-column: 1/ span 2;
  }
  .current-user-avatar, .new-comment-btn {
    grid-row: 2;
  }

  .new-comment-btn {
    margin-left: auto;
  }

  .delete-modal {
    width: 100%;
}


}
</style>
