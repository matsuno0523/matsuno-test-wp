/***
 * Googlemap 設置プラグイン(API)
 * 
 * usage:
 *   GOOGLEMAP({
 *     zoom: 14,
 *     markers:[
 *       {
 *         title:'マーカーのタイトル',
 *         address:'住所',
 *         latlng:'34.7057442,137.7163113',
 *         icon: '/asset/img/marker@2x.png',
 *         iconSize: '50,50',
 *         zIndex: 1
 *       }
 *     ]
 *   })
 * 
 * or
 * 
 *   <div data-plugin="googlemap"
 *     data-title="マーカーのタイトル"
 *     data-address="住所"
 *     data-latlng="34.7057442,137.7163113"
 *     data-icon="/asset/img/marker@2x.png"
 *     data-icon-size="50,50">
 *     <p class="padding-large text-center">Loading...</p>
 *   </div>
 */

 /* globals google, jQuery */
import mapstyle from '../../json/mapStyle.json'

const [d,$] = [document,jQuery]

// 現在地取得
const getCurrentPosition = () => {
  if ( !navigator.geolocation ) return false
  return new Promise( ( resolve, reject ) =>  navigator.geolocation.getCurrentPosition(
    // 取得成功した場合
    position => {
      // 緯度・経度を変数に格納
      const result = new google.maps.LatLng( position.coords.latitude, position.coords.longitude )
      resolve( result )
    },
    // 取得失敗した場合
    error => {
      // エラーメッセージを表示
      switch( error.code ) {
        case 1: // PERMISSION_DENIED
          console.error("位置情報の利用が許可されていません"); break
        case 2: // POSITION_UNAVAILABLE
          console.error("現在位置が取得できませんでした"); break
        case 3: // TIMEOUT
          console.error("タイムアウトになりました"); break
        default:
          console.error("その他のエラー(エラーコード:"+error.code+")"); break
      }
      reject( error.code )
    }
  ))
}

// GeoCodingで住所を座標に変換
const getLatlng = address => {
  const geocoder = new google.maps.Geocoder()
  return new Promise( ( resolve, reject ) => {
    geocoder.geocode({ address }, ( res, stat ) => {
      if( stat == google.maps.GeocoderStatus.OK ){
        const latlng = res[0].geometry.location
        resolve([ latlng.lat(), latlng.lng() ])
      } else { // ジオコーディングが成功しなかった場合
        reject(`Geocode was not successful for the following reason: ${stat}`)
      }
    })
  })
}

// マーカー配置
const putMarker = ( map, bounds, marker, putMarkerDef ) => {
  const position = new google.maps.LatLng( marker.latlng[0], marker.latlng[1] )
  const markerObj = new google.maps.Marker( { map, position, zIndex: marker.zIndex, animation: google.maps.Animation.DROP } )

  if( marker.iconSize == undefined && marker.icon != '' ){
    markerObj.setIcon( marker.icon )
  }
  if( marker.iconSize !== undefined && marker.icon != '' ){
    const iconSize = marker.iconSize.split(',')
    markerObj.setIcon( {
      url: marker.icon,
      scaledSize: new google.maps.Size( parseInt(iconSize[0]), parseInt(iconSize[1]) ),
    } )
  }
  bounds.extend( position )
  putMarkerDef.resolve()
  return markerObj
}

// infoWindow内容適用
const applyInfoWindow = ( map, markerObj, infoWindow, title, address, latlng, zoom ) => {
  //情報ウィンドウを開く
  infoWindow.setContent(`
    <div class="p-googlemap__infowindow">
      <div  style="max-width:250px">
        <div class="p-googlemap__infowindow-title" style="font-size:1.2em;">${title}</div>
        <div class="p-googlemap__infowindow-address">
          <p style="font-size:1em;margin:0.3em 0">${address}</p>
        </div>
      </div>
      <div class="view-link">
        <a target="_blank" style="color: #427fed;" href="https://maps.google.com/maps?ll=${latlng}&amp;q=${latlng}&amp;z=${zoom}&amp;hl=ja">
          <span>Googleマップで見る</span>
        </a>
      </div>
    </div>
  `)
  infoWindow.open( map, markerObj )
}

// jsonファイルからmapスタイルを適用
const setStyle = map =>{
  return new Promise( ( resolve, reject ) => {
    if( mapstyle ){
      const g_mapStyle = new google.maps.StyledMapType( mapstyle, { name: 'customStyle' } )
      map.mapTypes.set( 'customStyle', g_mapStyle )
      map.setMapTypeId( 'customStyle' )
      resolve( map )
    }else{
      reject( map )
    }
  })
}

// マーカー
const setMarker = ( markers, map, centerAdjust, tooltipFlg, zoom ) => {
  const markerDefArr = [] // markerごとのpromise格納
  const bounds = new google.maps.LatLngBounds()
  const infoWindow = new google.maps.InfoWindow()
  const makeMarker = ( marker, putMarkerDef ) => {
    const markerObj = putMarker( map, bounds, marker, putMarkerDef )
    if(tooltipFlg){
      google.maps.event.addListener( markerObj, "click", () => {
        applyInfoWindow( map, markerObj, infoWindow, marker.title, marker.address, marker.latlng.join(), zoom )
      })      
    }
  }
  markers.forEach( ( marker, i ) => {
    const putMarkerDef = new $.Deferred()
    markerDefArr.push( putMarkerDef.promise() )
    marker.zIndex = marker.zIndex || i
    if( !marker.latlng ){ // 座標データがない場合はGeocodingで住所から変換
      getLatlng(marker.address).then(latlng => {
        marker.latlng = latlng
        makeMarker( marker, putMarkerDef )
      })
    } else {
      marker.latlng = marker.latlng.split(',')
      makeMarker( marker, putMarkerDef )
    }
  })
  $.when.apply( $, markerDefArr ).done(() => {
    if(centerAdjust != ''){
      var centerLatlng = bounds.getCenter(),
          newLatlng = {
            lat:centerLatlng.lat() + parseFloat(centerAdjust.lat),
            lng:centerLatlng.lng() + parseFloat(centerAdjust.lng)
          };
      var newLatlngobj = new google.maps.LatLng( newLatlng.lat, newLatlng.lng )
      map.setCenter( newLatlngobj );
    }
    if(markers.length > 1) map.fitBounds( bounds )
  })
  return $.when.apply( $, markerDefArr )
}

// map作成
const mapinit = ( elm, option ) => {
  const opt = $.extend( true, {
    zoom: 14,
    scrollwheel:false,
    mapTypeControl: false,
    zoomControl:true,
    streetViewControl:false,
    tooltip:true,
    markers: [],
    centerAdjust:{
      lat:0,
      lng:0
    },
    mapstyle
  }, option, elm.dataset )

  const map = new google.maps.Map( elm, {
    zoom: opt.zoom,
    scrollwheel: opt.scrollwheel,
    mapTypeControl: opt.mapTypeControl,
    zoomControl: opt.zoomControl,
    streetViewControl: opt.streetViewControl,
  })

  // markerオプションが渡されなかった場合はHTMLタグの属性を使用する（1マーカー）
  if( opt.markers.length == 0 && opt.address != undefined && opt.title != undefined ){
    opt.markers[0] = {
      title: opt.title,
      address: opt.address,
      latlng: opt.latlng,
      icon: opt.icon,
      iconSize: opt.iconSize
    }
  }

  if( opt.markers.length == 0 && opt.address == undefined && opt.title == undefined && opt.latlng == undefined ){
    getCurrentPosition().then( latlng => map.setCenter( latlng ) )
  }

  // マップ・マーカ・スタイルを適用して戻り値（プロミスオブジェクト）をリターン
  return $.when(
    setMarker( opt.markers, map, opt.centerAdjust, opt.tooltip, opt.zoom ),
    setStyle( map )
  )
}

// constructor
export default function GOOGLEMAP ( opt, objquery = '[data-plugin="googlemap"]' ) {
  const defarr = [] // elmごとのpromise格納

  // mapを実行するブロックを配列化
  const elms = Array.prototype.slice.call( d.querySelectorAll( objquery ), 0 )
  if( elms.length == 0 ) return false

  // ブロックごとにmapinitを実行
  elms.forEach( elm => {
    const def = new $.Deferred()
    defarr.push( def.promise() )
    mapinit( elm, opt ).done( def.resolve )
  })

  return $.when.apply( $, defarr )
}