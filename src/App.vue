<template>
  <div class="app">
    <div class="app-bar">
      <el-select v-model="rootTree" size="mini" class="app-bar__select">
        <el-option label="书签栏" value="1"></el-option>
        <el-option label="其他书签" value="2"></el-option>
      </el-select>
      <ul>
        <li v-for="item in rootMarks" :key="item.id">
          <Bookmark
            v-if="item.url"
            :id="item.id"
            :parentId="item.parentId"
            :url="item.url"
            :title="item.title"
            class="app-bar__link"
            @refresh="refreshRoot"
          ></Bookmark>
          <p
            v-else
            class="app-bar__node"
            :class="{ 'app-bar__node-actived': curId === item.id }"
            @mouseover="getNodeChildren(item.id)"
          >
            {{ item.title }}
          </p>
        </li>
      </ul>
    </div>
    <div class="app-more">
      <el-row class="app-more__control">
        <el-col :span="8" style="padding: 5px;">
          <el-input
            v-model="searchTree"
            placeholder="回车搜索，当前列表"
            size="mini"
            clearable
            @keyup.enter.native="handleSearchTree"
          ></el-input>
        </el-col>
        <el-col :span="8" style="padding: 5px;">
          <el-input
            v-model="searchAll"
            placeholder="回车搜索，所有书签"
            size="mini"
            clearable
            @keyup.enter.native="handleSearchAll"
          ></el-input>
        </el-col>
        <el-col :span="8" style="padding: 5px; text-align: right;">
          <span class="app-more__control__tip">点击书签图标操作更多</span>
        </el-col>
      </el-row>
      <el-row class="app-more__content">
        <el-col :span="12">
          <MarkList :marks="leftMarks"></MarkList>
        </el-col>
        <el-col :span="12">
          <MarkList :marks="rightMarks"></MarkList>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import Bookmark from '@/components/Bookmark.vue'
import MarkList from '@/components/MarkList.vue'
import { getChildrenBookmark, searchBookmark } from '@/utils/bookmark'

export default {
  name: 'App',
  components: {
    Bookmark,
    MarkList
  },
  mounted() {
    this.getRootTree()
  },
  data() {
    return {
      rootTree: '1',
      rootMarks: [],
      leftMarks: [],
      rightMarks: [],
      curMarks: [],
      searchTree: '',
      searchAll: '',
      curId: null
    }
  },
  methods: {
    async getRootTree() {
      try {
        this.rootMarks = await getChildrenBookmark(this.rootTree)
      } catch (error) {
        this.$message.error('错误: getChildrenBookmark')
      }
    },
    async getNodeChildren(id) {
      try {
        const data = await getChildrenBookmark(id)
        this.curMarks = data
        this.curId = id
        this.viewChildren(data)
      } catch (error) {
        this.$message.error('错误: getChildrenBookmark')
      }
    },
    viewChildren(children) {
      const mid = Math.max(Math.ceil(children.length / 2), 25)
      this.leftMarks = children.slice(0, mid)
      this.rightMarks = children.slice(mid)
    },
    handleSearchTree() {
      const result = this.curMarks.filter(item => {
        const str = this.searchTree.toLowerCase()
        const url = item.url ? item.url.toLowerCase() : ''
        const title = item.title.toLowerCase()
        return url.includes(str) || title.includes(str)
      })
      this.viewChildren(result)
    },
    async handleSearchAll() {
      const data = await searchBookmark(this.searchAll)
      this.curMarks = data
      this.curId = null
      this.viewChildren(data)
    },
    refreshRoot() {
      this.getRootTree()
    }
  },
  watch: {
    rootTree() {
      this.getRootTree()
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --font-color: #333;
  --font-size: 12px;
  --line-color: #eee;
}
</style>

<style scoped>
.app {
  display: flex;
  flex-direction: row-reverse;
  width: 780px;
  height: 600px;
  overflow: hidden;
}

.app-bar {
  width: 100px;
  border-left: 1px solid var(--line-color);
  overflow: auto;
}

.app-bar ul {
  list-style: none;
}

.app-bar__select {
  margin: 5px;
}

.app-bar__link {
  padding-left: 5px;
}

.app-bar__node {
  cursor: default;
  padding: 10px 0;
  transition: all 0.3s;
  padding-left: 5px;
  font-size: 16px;
  color: var(--font-color);
  border-bottom: 1px dotted var(--line-color);
}

.app-bar__node-actived {
  background-color: var(--line-color);
}

.app-bar ul li img {
  margin-left: 5px;
  margin-top: 5px;
}

.app-more {
  flex: 1;
  padding-left: 3px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.app-more__content {
  flex: 1;
  overflow: auto;
}

.app-more__control__tip {
  color: #c0c4cc;
  font-size: 12px;
}
</style>
