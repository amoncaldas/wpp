/**
 * OrsMap component.
 * Renders an leaflet map using the ors api response
 * passed via props
 * @listens redrawAndFitMap [via eventBus] - event that will trigger an map redraw and refit bounds - expects {isMaximized: Boolean, guid: String}
 * @emits orsMapCreated [to-parent] - returning the guid of the ors mao instance
 */

import { LMap, LTileLayer, LMarker, LPolyline, LLayerGroup, LTooltip, LPopup, LControlZoom, LControlAttribution, LControlScale, LControlLayers, LGeoJson, LPolygon } from 'vue2-leaflet'
import OrsMapBuilder from './services/map-builder'
import utils from '@/support/utils'
import GeoUtils from '@/support/geo-utils'
import theme from '@/common/theme'

export default {
  props: {
    responseData: {
      required: true
    },
    requestData: {
      required: false // only needed if requesting a gpx response
    },
    apiVersion: {
      required: true
    }
  },
  data () {
    return {
      baseMap: {
        name: 'OpenStreetMap',
        visible: true,
        attribution: '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      },
      zoom: 13,
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      map: null,
      mapDataBuilder: null,
      mapHeight: 300,
      initialMaxZoom: 18,
      mapData: null,
      info: null,
      routeColor: theme.primary,
      guid: null
    }
  },
  computed: {
    options () {
      let tooltip = this.routeToolTip
      return {
        onEachFeature: (feature, layer) => {
          layer.bindTooltip(tooltip, { permanent: false, sticky: true })
        }
      }
    },
    polyLineData () {
      if (this.mapData) {
        return this.mapData.polyLineData
      }
    },
    polygons () {
      if (this.mapData) {
        return this.mapData.polygons
      }
    },
    routeToolTip () {
      if (this.mapData) {
        return this.humanizeRouteToolTip(this.mapData.routeSummaryData)
      }
    },
    markers () {
      if (this.mapData) {
        return this.mapData.markers
      }
    },
    geoJson () {
      if (this.mapData) {
        return this.mapData.geoJson
      }
    },
    maxZoom () {
      if (this.mapData) {
        return this.mapData.maxZoom
      }
      return this.initialMaxZoom
    }
  },
  watch: {
    responseData: {
      handler: function () {
        this.setMapBuilder()
        this.loadMapData()
      },
      deep: true
    }
  },
  methods: {
    setMapBuilder () {
      if (!this.mapDataBuilder) {
        let data = {
          responseData: this.responseData,
          requestData: this.requestData,
          translations: this.$t('orsMap'),
          apiVersion: this.apiVersion
        }
        this.mapDataBuilder = new OrsMapBuilder(data)
      }
    },
    supportsEndpoint (endpoint) {
      OrsMapBuilder.supportsEndpoint(endpoint)
    },
    loadMapData () {
      // To load map data we use the map builder service
      // and then once it is ready, we set the local data from
      // the data returned by the builder
      // and then set the bounds, fit the bounds and redraw the map
      // If the response data does not contains a geojson
      // then the promise resolver will return an object with the expected
      // props but all of then containing null values. This will not cause a fail
      this.mapDataBuilder.buildMapData().then(mapData => {
        mapData.maxZoom = mapData.maxZoom ? mapData.maxZoom : this.initialMaxZoom
        this.mapData = mapData
        this.info = mapData.info
        this.dataBounds = mapData.bbox
        this.fitFeaturesBounds()
        this.redrawMap()
      })
    },
    redrawMap () {
      return new Promise((resolve, reject) => {
        // This is a hack to force leaflet redraw/resize correctly the maps
        // in the case when there are two map viewers and the container of one of them
        // is resized.
        // The candidates map.invalidateSize() and map.eachLayer(function(layer){layer.redraw();});
        // have not worked at all on this case
        // @see https://github.com/Leaflet/Leaflet/issues/694
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'))
          resolve()
        }, 10)
      })
    },
    fitFeaturesBounds () {
      let context = this
      return new Promise((resolve, reject) => {
        // If te map object is already defined
        // then we can directly access it
        if (context.map) {
          context.map.fitBounds(context.dataBounds, {padding: [20, 20]})
        } else {
          // If not, it wil be available only in the next tick
          this.$nextTick(() => {
            if (context.$refs.map) {
              context.map = context.$refs.map.mapObject // work as expected when wrapped in a $nextTick
              context.map.fitBounds(context.dataBounds, {padding: [20, 20], maxZoom: 18})
            }
            resolve()
          })
        }
      })
    },
    markerInfoClick (marker) {
      this.infoDialog(marker.label, null, {code: marker.json, resizable: true, zIndex: 1001})
    },
    polygonInfoClick (polygon) {
      this.infoDialog(polygon.label, null, {code: polygon.json, resizable: true, zIndex: 1001})
    },

    /**
     * Get the polyline humanized tool tip if the response contains a route summary
     * @returns {Array} coordinates
     */
    humanizeRouteToolTip (tooltipData) {
      if (typeof tooltipData === 'object' && tooltipData.distance && tooltipData.unit && tooltipData.duration) {
        let humanizedData = GeoUtils.getHumanizedTimeAndDistance(tooltipData, this.$t('orsMap'))
        let formattedTooltip = `${this.$t('orsMap.distance')} ${humanizedData.distance}<br>${this.$t('orsMap.duration')} ${humanizedData.duration}`
        return formattedTooltip
      }
    },
    adjustMap (isMaximized) {
      window.dispatchEvent(new Event('resize'))
      // if the map is maximized, then the height
      // will be the window height less an offset
      if (isMaximized) {
        this.mapHeight = window.innerHeight - 300
      } else { // if not, the height is fixed
        this.mapHeight = 300
      }
      // After map container box is resized
      // we need to wait a little bit
      // to redraw the map and then
      // wait a little bit more to fit the bounds
      setTimeout(() => {
        // Redraw the map and then wait
        this.redrawMap().then(() => {
          setTimeout(() => {
            // After redrawing and waiting
            // fit the bounds
            this.fitFeaturesBounds()
          }, 500)
        })
      }, 500)
    }
  },
  mounted () {
    // Define a unique identifier to the map component instance
    this.guid = utils.guid()

    // When the box is created, it emit
    // an event to its parent telling the parent its guid
    this.$emit('onCreate', this.guid)

    // When the box that contains the map is resized
    // we need to resize the map height, redraw the map
    // and then fit the bounds
    let context = this
    this.eventBus.$on('redrawAndFitMap', (data) => {
      if (data.guid && data.guid === context.guid) {
        this.adjustMap(data.isMaximized)
      }
    })
    // once the map component is mounted, load the map data
    this.setMapBuilder()
    this.loadMapData()
  },
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPolyline,
    LLayerGroup,
    LTooltip,
    LPopup,
    LControlZoom,
    LControlAttribution,
    LControlScale,
    LControlLayers,
    LGeoJson,
    LPolygon
  }
}
