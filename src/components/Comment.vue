<template>

    <div class='delete-modal-wrapper' v-if="isDeleteModal">
        <div class='delete-modal'>
            <h1 class='delete-modal-title'>Delete comment</h1>
            <p class='delete-modal-text'>Are you sure you want to delete this comment? This will remove the comment and can't be undone</p>
            <div class='delete-btn-container'>
            <button class='delete-back-btn' @click="toggleDeleteModal">No, back</button>
            <button 
                class='delete-btn' 
                @click="props.handleDelete(props.comment.id, props.isReply, props.parentId)"
            >
                Yes, delete
            </button>
            </div>
        </div>
    </div>
    
    <div class="comment">
        <div class='comment-section'>
            <div class="comment-score">
                <FontAwesomeIcon 
                    icon="fa-solid fa-plus"
                    size='xs'  
                    alt="Upvote" 
                    class='upvote action' 
                    @click="emit('handleUpvote', props.comment.id, props.isReply, props.parentId)"
                />
                <p class='comment-score-text'>{{props.comment.score}}</p>
                <FontAwesomeIcon 
                    icon="fa-solid fa-minus"
                    size='xs'  
                    alt="Downvote" 
                    class='downvote action' 
                    @click="emit('handleDownvote',props.comment.id, props.isReply, props.parentId)"
                />
            </div>
            <div class='comment-user-info'>
                <img class="comment-avatar" :src="props.comment.user.image.png" />
                <p class="comment-author">{{props.comment.user.username}}</p>
                <p class='self-tag' v-if="props.currentUser.username == props.comment.user.username ">you</p>
                <p class="comment-time">{{compareDates(props.comment.createdAt)}}</p>
            </div>
            <div class="comment-actions">
               <div class="delete-action action" @click="toggleDeleteModal" v-if="props.currentUser.username == props.comment.user.username">
                    <img class="delete-icon" src='/images/icon-delete.svg' />
                    <p class="delete-text">Delete</p>
                </div>
                <div class="edit-action action" @click="toggleIsEditing" v-if="props.currentUser.username == props.comment.user.username">
                    <img class="edit-icon" src='/images/icon-edit.svg'/>
                    <p class="edit-text">Edit</p>
                </div>            
               <div v-else class="reply-action action"  @click="toggleisReplying">
                    <img class="reply-icon" src='/images/icon-reply.svg' />
                    <p class="reply-text">Reply</p>
                </div>
                
            </div>
          
            <div class='edit-wrapper' v-if="isEditing">
                <textarea rows={4} class="edit-comment-text" name='commentText' v-model="commentTextValue" ></textarea>
                <button 
                    class='save-edit btn' 
                    @click="enableComment"
                >
                    Update
                </button>
            </div>
            
            <div class="comment-text" v-else>
                 <span v-if="props.comment.replyingTo" class='replyTo'>@{{props.comment.replyingTo}}</span> {{props.comment.content}}
            </div>
            
        </div>
        
        <div class='replying-section' v-if="isReplying">
            <img class="comment-avatar" :src="props.currentUser.image.png"/>
            <textarea rows={4} class="reply-comment-text" v-model="replyingTextValue" ></textarea>
            <button 
                class='reply-edit btn' 
                @click="enableReply"
            >
                Reply
            </button>
        </div>
        
        <div class='replies-section' v-if="props.comment.replies?.length > 0">
            <div class='replies-divider'></div>
            <div class='replies-content'>
                <Comment v-for="reply in props.comment.replies"
                    :key="reply.id"
                    :comment="reply"
                    :isReply="true" 
                    :currentUser="currentUser"
                    :updateComment="props.updateComment"
                    :parentId="props.parentId"
                    :handleDelete="props.handleDelete"
                    :handle-reply="props.handleReply"
                    @handleUpvote="emit('handleUpvote', reply.id, true, props.parentId)"
                    @handleDownvote="emit('handleDownvote', reply.id, true, props.parentId)"
                />
            </div>
        </div>
    </div>

</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { ref } from 'vue';
import {compareDates} from '../compareDate'

const props = defineProps([
    "currentUser",
    "isReply",
    "comment",
    "parentId",
    "updateComment",
    "handleDelete",
    "handleReply"
])

const isEditing = ref(false)
const isReplying = ref(false)
const commentTextValue = ref("")
const replyingTextValue = ref("")
const isDeleteModal = ref(false)

const emit = defineEmits(['handleReply', 'handleUpvote', 'handleDownvote'])

function toggleDeleteModal(){
    isDeleteModal.value = !isDeleteModal.value
}

function toggleisReplying(){
    replyingTextValue.value = "@" + props.comment.user.username + " "
    isReplying.value = !isReplying.value
} 

function toggleIsEditing(){
    if(props.comment.content !== commentTextValue.value){
        commentTextValue.value = props.comment.content
    }
    if(props.isReply){
        commentTextValue.value = "@" + props.comment.replyingTo + " " + props.comment.content
    }
    isEditing.value = !isEditing.value
}

function enableReply(){
    props.handleReply(props.parentId, replyingTextValue.value, props.comment.user.username)
    toggleisReplying();
}

function enableComment(){
    props.updateComment(props.comment.id, commentTextValue.value, props.isReply, props.parentId ); 
    toggleIsEditing();
}
    
</script>

<style>
.comment {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    width: 100%;
}


.comment-section {
    width: 100%;
    display: grid;
    grid-template-columns: 1.875rem repeat(2, auto);
    grid-template-rows: repeat(3, auto);
    gap: 1.25rem;
    padding: 1.875rem;
    background-color: white;
    border-radius: 0.625rem;
}

.comment-score {
    grid-column: 1;
    grid-row: 1 / span 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
    padding: 0.625rem;
    background-color: hsl(223, 19%, 93%);
    border-radius: 0.313rem;
    height: fit-content;
}

.comment-score-text {
    color: hsl(238, 40%, 52%);
    font-weight: 700;
}


.comment-user-info {
    display: flex;
    align-items: center;
    gap: 0.625rem
}
.comment-content {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
    height: fit-content;
    color:  hsl(211, 10%, 45%);
    font-weight: 400;
    font-size: 1rem;
    width: 100%;
}

.comment-header {
    display: flex;
    align-items: center;
    gap: 0.625rem;
}

.comment-avatar {
    width: 1.875rem;
    height: 1.875rem;
}

.comment-author {
    color: hsl(212, 24%, 26%);
    font-weight: 700;
}

.comment-actions {
    grid-column: 3;
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 1.25rem;
}

.comment-actions > div {
    display: flex;
    align-items: center;
    gap: 0.313rem;
}


.comment-text  {
    text-align: start;
    grid-column: 2 / span 2;
    color: hsl(211, 10%, 45%);
}


.replies-section {
    display: flex;
    flex: 1;
    justify-content: center;
    height: fit-content;
    background: hsl(228, 33%, 97%);
}

.replies-divider {
    width: 0.125rem;
    margin: 0.625rem 2.313rem;
    background: hsl(223, 19%, 93%);;
}
 
.replies-content {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    width: 100%;
}

.replyTo {
    color: hsl(238, 40%, 52%);
    font-weight: 700;
}

.self-tag {
    background-color: hsl(238, 40%, 52%);
    color: white;
    padding-inline: 0.313rem;
}


textarea {
    font-family: 'Rubik', sans-serif;
    font-size: 1rem;
    height: fit-content;
    padding: 0.625rem 1.25rem;
    border: 0.063rem solid black;
    border-radius: 0.625rem;
    resize: none;
}

textarea:focus {
    outline: none
}

.edit-wrapper {
    grid-column: 2 / span 2;
    display: flex;
    gap: 0.625rem;
}

.edit-comment-text {
    width: 100%;
}

.save-edit {
    margin-left: auto;
}


.replying-section {
    background-color: white;
    border-radius: 0.625rem;
    width: 100%;
    padding: 1.25rem;;
    display: flex;
    gap: 1.25rem;
}

.reply-comment-text {
    width: 100%;
}

.upvote, .downvote {
    color: #C5C6EF;
}

.upvote:hover, .downvote:hover {
    color: hsl(238, 40%, 52%);
}

.action:hover {
    cursor: pointer;
    filter: opacity(.8);
}

.reply-text, .edit-text {
    color: hsl(238, 40%, 52%);
    font-weight: 500;
}

.delete-text {
    color: hsl(358, 79%, 66%);
    font-weight: 500;
}

.delete-back-btn:hover, .delete-btn:hover {
    filter: opacity(0.8);
}


@media screen and (max-width: 47rem) {
    .comment-user-info {
        grid-column: 1 / span 3;
        grid-row: 1;
    }
    .comment-score {
        grid-row: 3;
        flex-direction: row;
        width: fit-content;
        gap: 0.63rem;
    }

    .comment-text {
        grid-row: 2;
        grid-column: 1 / span 3;
    }

    .edit-wrapper {
        grid-row: 2;
        grid-column: 1 / span 3;
        display: flex;
        flex-direction: column;
        gap: 0.625rem;
    }

    .edit-comment-text {
        display: 100%;
    }

    .comment-actions {
        grid-row: 3;
    }

    .comment-time {
        font-size: 0.8rem;
    }

    .replying-section {
        display: grid;
    }

    .comment-avatar {
        grid-row: 2
    }

    .reply-edit {
        margin-left: auto;
        grid-row: 2
    }

    .reply-comment-text {
        grid-column: 1 / span 2;
    }

    .replies-section {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(2, auto);
    }

    .replies-divider {
        width: 0.125rem;
        margin-inline: 0.625rem;
    }

    .replies-content {
        display: flex;
        justify-content: space-between
    }


}
</style>