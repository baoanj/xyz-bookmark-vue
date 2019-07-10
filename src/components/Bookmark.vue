<template>
  <p class="bookmark">
    <el-popover v-model="visible" placement="right" trigger="click">
      <div class="bookmark-popover">
        <el-button type="text" @click="move">移到首位</el-button>
        <el-button type="text" @click="remove">删除</el-button>
      </div>
      <img slot="reference" :src="`chrome://favicon/size/8@2x/${url}`" />
    </el-popover>
    <a :title="`${title}\n${url}`" :href="url" target="_blank">{{ title }}</a>
  </p>
</template>

<script>
import { moveBookmark, removeBookmark } from '@/utils/bookmark'

export default {
  name: 'Bookmark',
  props: ['id', 'parentId', 'url', 'title'],
  data() {
    return {
      visible: false
    }
  },
  methods: {
    async move() {
      try {
        await moveBookmark(this.id, {
          parentId: this.parentId,
          index: 0
        })
        this.visible = false
        this.$emit('refresh')
      } catch (error) {
        this.$message.error('错误: move')
      }
    },
    async remove() {
      try {
        await removeBookmark(this.id)
        this.visible = false
        this.$emit('refresh')
      } catch (error) {
        this.$message.error('错误: remove')
      }
    }
  }
}
</script>

<style scoped>
.bookmark {
  padding: 3px 0;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.bookmark:hover {
  background-color: var(--line-color);
}

.bookmark a {
  color: var(--font-color);
  text-decoration: none;
  font-size: var(--font-size);
}

.bookmark img {
  max-width: 16px;
  max-height: 16px;
  vertical-align: bottom;
}
</style>

<style>
.bookmark-popover .el-button--text {
  padding: 0;
}
</style>
