<template>
  <div>
    经度
    <el-input
      v-model="value.lng"
      style="width: 32%;"
    />
    纬度
    <el-input
      v-model="value.lat"
      style="width: 32%;"
    />
    <el-button
      size="small"
      type="success"
      @click="map.mapvisible = true"
    >
      地图选点
    </el-button>
    <el-dialog
      :visible.sync="map.mapvisible"
      title="地图选点"
    >
      <el-row>
        <el-row>
          <el-input
            v-model="map.keyword"
            placeholder="搜索地点"
            style="width: 200px;"
          />
        </el-row>
        <el-row>
          <div style="margin-top: 10px;">
            <baidu-map
              :zoom="15"
              :center="center"
              :dragging="true"
              :scroll-wheel-zoom="true"
              ak="415167759dc5861ddbbd14154f760c7e"
              class="map"
              @click="click"
              @load="load"
            >
              <bm-view style="width: 100%; height:200px; flex: 1" />
              <bm-local-search
                :keyword="map.keyword"
                :location="map.location"
                :auto-viewport="true"
                :panel="true"
                :page-capacity="5"
                @infohtmlset="set"
              />
              <bm-marker
                v-if="map.map.lng!=0.0 && map.map.lat!=0.0"
                :position="map.map"
                :dragging="true"
                @dragend="dragend"
              />
              <bm-geolocation
                anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
                :show-address-bar="true"
                :auto-location="true"
                @locationSuccess="location"
              />
            </baidu-map>
          </div>
        </el-row>
      </el-row>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="map.mapvisible = false">
          取 消
        </el-button>
        <el-button
          type="primary"
          @click="confirmPoint()"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { BaiduMap, BmMarker, BmLocalSearch, BmView, BmGeolocation } from 'vue-baidu-map'
export default {
  name: 'location',
  components: { BaiduMap, BmMarker, BmLocalSearch, BmView, BmGeolocation },
  props: {
    value: {
      type: Object,
      default () {
        return {
          lat: null,
          lng: null
        }
      }
    }
  },
  data: function () {
    return {
      center: undefined,
      map: {
        mapvisible: false,
        keyword: '',
        map: {
          lng: 0.0,
          lat: 0.0
        }
      }
    }
  },
  methods: {
    load () {
      if (this.value.lat != undefined && this.value.lng != undefined) {
        this.map.map.lat = this.value.lat
        this.map.map.lng = this.value.lng
        this.center = this.map.map
      } else {
        this.center = '北京'
      }
    },
    confirmPoint () {
      this.$set(this.value, 'lat', this.map.map.lat)
      this.$set(this.value, 'lng', this.map.map.lng)
      this.map.mapvisible = false
      this.$emit('input', this.value)
    },
    dragend (type) {
      this.map.map.lng = type.point.lng
      this.map.map.lat = type.point.lat
    },
    click (type) {
      this.map.map.lng = type.point.lng
      this.map.map.lat = type.point.lat
    },
    set (loc) {
      this.map.map.lng = loc.point.lng
      this.map.map.lat = loc.point.lat
    },
    location (loc) {
      this.map.map.lng = loc.point.lng
      this.map.map.lat = loc.point.lat
    }
  }
}
</script>
