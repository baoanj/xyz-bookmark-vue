<template>
  <div>
    <div v-for="item in renderMarks" :key="item.id">
      <Bookmark
        v-if="item.url"
        :id="item.id"
        :parentId="item.parentId"
        :url="item.url"
        :title="item.title"
        @refresh="refresh"
      ></Bookmark>
      <el-button
        v-else
        type="text"
        icon="el-icon-folder"
        class="marklist-folder"
        @click="show(item.id, item.title)"
      >
        {{ item.title }}
      </el-button>
    </div>
    <el-dialog
      :title="title"
      :visible.sync="visible"
      top="0"
      width="80%"
      :append-to-body="true"
      class="marklist-dialog"
    >
      <el-input
        v-model="search"
        placeholder="回车搜索"
        size="mini"
        clearable
        @keyup.enter.native="handleSearch"
      ></el-input>
      <MarkList :marks="viewList"></MarkList>
    </el-dialog>
  </div>
</template>

<script>
import { getChildrenBookmark } from '@/utils/bookmark'
import Bookmark from './Bookmark.vue'

export default {
  name: 'MarkList',
  components: {
    Bookmark
  },
  props: ['marks'],
  data() {
    return {
      renderMarks: this.marks,
      timer: null,
      visible: false,
      list: [],
      viewList: [],
      title: '',
      search: ''
    }
  },
  methods: {
    async show(id, title) {
      try {
        const data = await getChildrenBookmark(id)
        this.list = data
        this.viewList = data
        this.title = title
        this.visible = true
      } catch (error) {
        this.$message.error('错误: getChildrenBookmark')
      }
    },
    handleSearch() {
      const result = this.list.filter(item => {
        const str = this.search.toLowerCase()
        const url = item.url ? item.url.toLowerCase() : ''
        const title = item.title.toLowerCase()
        return url.includes(str) || title.includes(str)
      })
      this.viewList = result
    },
    refresh() {
      this.$message.success('成功，请重新获取数据')
    }
  },
  watch: {
    marks(val) {
      // 为避免卡顿，先渲染部分数据，然后再渲染全部数据
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
      if (val.length > 30) {
        this.renderMarks = val.slice(0, 30)
        this.timer = setTimeout(() => {
          this.renderMarks = val
        }, 200)
      } else {
        this.renderMarks = val
      }
    }
  }
}
</script>

<style scoped>
.marklist-folder {
  padding: 0;
}
</style>

<style>
.marklist-dialog .el-dialog {
  margin: 0 auto;
  width: 80%;
  height: 100%;
  overflow: hidden;
}

.marklist-dialog .el-dialog__body {
  padding: 0px 20px;
  height: calc(100% - 54px);
  overflow: auto;
}
</style>
