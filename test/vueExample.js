var people = [
  { name: 'Jack', age: 22, sex: 'Female' },
  { name: 'Mike', age: 25, sex: 'Male' },
  { name: 'Alex', age: 29, sex: 'Male' },
  { name: 'John', age: 19, sex: 'Female' },
  { name: 'Jack', age: 22, sex: 'Female' },
  { name: 'Mike', age: 25, sex: 'Male' },
  { name: 'Alex', age: 29, sex: 'Male' },
  { name: 'Jack', age: 22, sex: 'Female' },
  { name: 'Mike', age: 25, sex: 'Male' },
  { name: 'Alex', age: 29, sex: 'Male' },
  { name: 'Jack', age: 22, sex: 'Female' },
  { name: 'Mike', age: 25, sex: 'Male' },
  { name: 'Alex', age: 29, sex: 'Male' },
  { name: 'Jack', age: 22, sex: 'Female' },
  { name: 'Mike', age: 25, sex: 'Male' },
  { name: 'Alex', age: 29, sex: 'Male' },
  { name: 'Jack', age: 22, sex: 'Female' },
  { name: 'Mike', age: 25, sex: 'Male' },
  { name: 'Alex', age: 29, sex: 'Male' },
  { name: 'Jack', age: 22, sex: 'Female' },
  { name: 'Mike', age: 25, sex: 'Male' },
  { name: 'Alex', age: 29, sex: 'Male' },
  { name: 'Jack', age: 22, sex: 'Female' },
  { name: 'Mike', age: 25, sex: 'Male' },
  { name: 'Alex', age: 29, sex: 'Male' },
  { name: 'Jack', age: 22, sex: 'Female' },
  { name: 'Mike', age: 25, sex: 'Male' },
  { name: 'Alex', age: 29, sex: 'Male' },
  { name: 'Alex', age: 29, sex: 'Male' }
];
//创建组件
var edit = Vue.extend({
  template: "#edit-template",
  props: ["item", "title", "mode", "columns"],
  data: function () { return { isShow: false }; },
  events: {
    editShow: function () { this.isShow = true; }
  },
  methods: {
    closeDialog: function () { this.isShow = false; },
    save: function () {
      this.isShow = false;
      this.$dispatch('edit-complete');
    }
  }
});
var page = Vue.extend({
  template: "#page-template",
  ready: function () {
    this.pages = Math.ceil(this.total * 1.0 / this.pageSize);
  },
  data: function () {
    return {
      pages: 0,		//总页数
      curIndex: 1    	//当前是第几页
    };
  },
  props: {
    total: { type: Number, required: true },
    pageSize: { type: Number, default: 5 }
  }
});
var grid = Vue.extend({
  components: { 'edit': edit, 'page': page },
  props: ["people", "columns"],
  template: "#grid-template",
  ready: function () {//组件加载完毕自动调用此函数
    for (var i = 0; i < this.columns.length; i++) {
      if (this.columns[i].isKey) {
        this.keyColumn = this.columns[i].name;
        break;
      }
    }
  },
  data: function () {
    return {
      keyColumn: '',//用于记录数据主键属性名
      item: {},
      title: '',
      mode: true
    };
  },
  methods: {
    del: function (key) {
      if (!confirm('真删?')) return;
      var that = this;
      $.ajax({
        url: "http://localhost:8080/person/del?key=" + key,
        data: { name: key },
        success: function (result) {
          if (result != "1") { alert(result); return; }
          for (var i = 0; i < that.people.length; i++) {
            if (that.people[i][that.keyColumn] === key) {
              that.people.splice(i, 1);
              break;
            }
          }
        }
      });
    },
    save: function () {
      var that = this;
      var data = {
        key: this.item[this.keyColumn],
        age: this.item['age'],
        sex: this.item['sex']
      };
      if (!this.mode) {//修改
        $.ajax({
          url: "http://localhost:8080/person/update",
          type: "post",
          data: data,
          success: function (result) {
            if (result != "1") { alert(result); return; }
            for (var i = 0; i < that.people.length; i++) {
              if (that.people[i][that.keyColumn] ==
                that.item[that.keyColumn])
                break;
            }
            for (var p in that.item) {
              that.people[i][p] = that.item[p];
            }
            alert('修改完成..');
          }
        });
      } else {//新增
        $.ajax({
          url: "http://localhost:8080/person/add",
          type: "post",
          data: data,
          success: function (result) {
            if (result != "1") { alert(result); return; }
            that.people.push(that.item);
            alert('添加成功');
          }
        });
      }
    },
    openEditDialog: function (key) {
      if (typeof key == 'undefined') {//新增
        this.item = {};
        this.mode = true;
        this.title = 'Add new item';
      } else {//是修改
        for (var i = 0; i < this.people.length; i++) {
          if (this.people[i][this.keyColumn] == key)
            break;
        }
        //深复制this.people[i]给this.item
        this.item = this.initItemForUpdate(this.people[i]);
        this.mode = false;
        this.title = 'Edit for - '
          + this.people[i][this.keyColumn];
      }
      this.$broadcast('editShow');
    },
    initItemForUpdate: function (p, c) {
      c = c || {};
      for (pro in p) {
        if (p.hasOwnProperty(pro)) {
          if (typeof p[pro] == 'object') {
            c[pro] = Array.isArray(p[pro]) ? [] : {};
            c[pro] = initItemForUpdate(p[pro]);
          } else
            c[pro] = p[pro];
        }
      }
      return c;
    },
    isExits: function (key) {
      for (var i = 0; i < this.people.length; i++) {
        if (this.people[i][this.keyColumn] == key)
          return true;
      }
      return false;
    }
  }
});
//注册组件
Vue.component('grid', grid);
//创建根组件并挂载至#app上
var mongodbData;
$.ajax({
  async: false,
  url: "http://localhost:8080/person/getAll",
  success: function (data) {
    console.log(data)
    mongodbData = data;
  }
});//ajax请求从mongodb数据库中拿数据
var app = new Vue({
  el: "#app",
  data: {
    people: JSON.parse(mongodbData),
    columns: [
      { name: 'name', isKey: true },
      { name: 'age' },
      { name: 'sex', dataSource: ['Male', 'Female'] }
    ]
  }
});//将拿回的json数据给app组件，显示信息