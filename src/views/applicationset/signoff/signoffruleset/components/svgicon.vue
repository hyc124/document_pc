<template>
  <!-- <div class="custom-icons-list"> -->
  <div>
    <time-icon v-if="item.num==0" />
    <path-icon v-if="item.num==1" />
    <liang-icon v-if="item.num==2" />
    <liangadd-icon v-if="item.num==3" />
  </div>
  <!-- </div> -->
</template>
<script>
// 发文拟稿
const Time = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
  
  <g id="组_3556" data-name="组 3556" transform="translate(-98.816 -87.04)">
    <path id="路径_2492" data-name="路径 2492" class="cls-1" d="M104.816,87.871A5.169,5.169,0,1,1,99.64,93.04a5.177,5.177,0,0,1,5.176-5.169m0-.831a6,6,0,1,0,6,6,6,6,0,0,0-6-6Z" transform="translate(0)"/>
    <path id="路径_2493" data-name="路径 2493" class="cls-1" d="M386.452,384.329a.422.422,0,0,1-.3-.128l-2.282-2.282a.431.431,0,1,1,.61-.61l2.282,2.282a.433.433,0,0,1-.309.738Z" transform="translate(-280.962 -290.05)"/>
    <path id="路径_2494" data-name="路径 2494" class="cls-1" d="M495.021,282.611a.429.429,0,0,1-.429-.429v-4.248a.429.429,0,0,1,.859,0v4.241A.436.436,0,0,1,495.021,282.611Z" transform="translate(-390.205 -187.853)"/>
    <path id="路径_2495" data-name="路径 2495" class="cls-1" d="M166.965,483.675h-.648a.429.429,0,1,1,0-.859h.648a.429.429,0,1,1,0,.859Z" transform="translate(-66.085 -390.205)"/>
    <path id="路径_2496" data-name="路径 2496" class="cls-1" d="M780.846,483.675h-.64a.429.429,0,1,1,0-.859h.648a.429.429,0,0,1,.429.429A.436.436,0,0,1,780.846,483.675Z" transform="translate(-671.446 -390.205)"/>
    <path id="路径_2497" data-name="路径 2497" class="cls-1" d="M494.509,154.594h0a.429.429,0,0,1-.429-.429v-.648a.429.429,0,0,1,.429-.429h0a.429.429,0,0,1,.429.429v.648A.434.434,0,0,1,494.509,154.594Z" transform="translate(-389.7 -65.076)"/>
    <path id="路径_2498" data-name="路径 2498" class="cls-1" d="M494.509,770.018a.429.429,0,0,1-.429-.429v-.648a.429.429,0,0,1,.429-.429h0a.429.429,0,0,1,.429.429v.648a.434.434,0,0,1-.429.429Z" transform="translate(-389.7 -671.95)"/>
  </g>
</svg>


  `
};
const Path = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
  
  <path id="路径_2491" data-name="路径 2491" class="cls-1" d="M156.5,118.684h.857a.429.429,0,0,1,0,.857H156.5a.429.429,0,0,1,0-.857Zm0-2.555h.857a.429.429,0,1,1,0,.857H156.5a.429.429,0,1,1,0-.857Zm-3.43,2.555h.857a.429.429,0,0,1,0,.857h-.857a.429.429,0,1,1,0-.857Zm0-2.555h.857a.429.429,0,1,1,0,.857h-.857a.429.429,0,1,1,0-.857Zm-3.43,2.555h.857a.429.429,0,0,1,0,.857h-.857a.429.429,0,0,1,0-.857Zm0-2.555h.857a.429.429,0,0,1,0,.857h-.857a.429.429,0,1,1,0-.857Zm6.43-5.159h1.714a1.715,1.715,0,0,1,1.714,1.714v7.3a1.715,1.715,0,0,1-1.714,1.714h-8.571a1.715,1.715,0,0,1-1.714-1.714v-7.3a1.715,1.715,0,0,1,1.714-1.714h1.714v-.841a.429.429,0,0,1,.857,0v.841h3.429v-.841a.429.429,0,1,1,.857,0Zm2.571,3.874H148.357v5.174a.858.858,0,0,0,.857.857h8.571a.858.858,0,0,0,.857-.857Zm0-.857v-1.334a.858.858,0,0,0-.857-.857h-1.714v.9a.429.429,0,1,1-.857,0v-.9h-3.429v.9a.429.429,0,0,1-.857,0v-.9h-1.714a.858.858,0,0,0-.857.857v1.334Z" transform="translate(-147.5 -109.7)"/>
</svg>

  `
};
const Liang = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
 
  <path id="路径_2502" data-name="路径 2502" class="cls-1" d="M107.143,102v5.143h-3.428V102h3.428m0-.857h-3.428a.857.857,0,0,0-.857.857v5.143a.857.857,0,0,0,.857.857h3.428a.857.857,0,0,0,.857-.857V102A.857.857,0,0,0,107.143,101.143Zm0-4.287v2.572h-3.428V96.857h3.428m0-.857h-3.428a.857.857,0,0,0-.857.857v2.572a.857.857,0,0,0,.857.857h3.428a.857.857,0,0,0,.857-.857V96.857A.857.857,0,0,0,107.143,96Zm-6,.857v6H96.857v-6h4.287m0-.857H96.857a.857.857,0,0,0-.857.857v6a.857.857,0,0,0,.857.857h4.285a.857.857,0,0,0,.857-.857v-6A.855.855,0,0,0,101.143,96Zm0,9.428v1.715H96.857v-1.715h4.287m0-.857H96.857a.857.857,0,0,0-.857.857v1.715a.857.857,0,0,0,.857.857h4.285a.857.857,0,0,0,.857-.857v-1.715A.855.855,0,0,0,101.143,104.572Z" transform="translate(-96 -96)"/>
</svg>


  `
};
const Addlinag = {
  template: `
 <svg id="组_3557" data-name="组 3557" xmlns="http://www.w3.org/2000/svg" width="12" height="11.87" viewBox="0 0 12 11.87">
  <path id="路径_2499" data-name="路径 2499" class="cls-1" d="M188.537,187.733h8.235a.8.8,0,0,1,.8.8v8.1a.8.8,0,0,1-.8.8h-8.235a.8.8,0,0,1-.8-.8v-8.1A.8.8,0,0,1,188.537,187.733Zm0,.8v8.235h8.235v-8.235Z" transform="translate(-185.576 -185.575)"/>
  <path id="路径_2500" data-name="路径 2500" class="cls-1" d="M9.842,1.607V.8a.8.8,0,0,0-.8-.8H.8A.8.8,0,0,0,0,.8v8.1a.8.8,0,0,0,.8.8h.8V9.039H.8V.8H9.039v.8h.8Z"/>
  <path id="路径_2501" data-name="路径 2501" class="cls-1" d="M397.755,377.706h-2.238v-2.239h-.752v2.239h-2.233v.747h2.238v2.237h.748v-2.237h2.237Z" transform="translate(-387.948 -371.082)"/>
</svg>
  `
};
const TimeIcon = {
  template: `
    <a-icon :component="Time" />
  `,
  data() {
    return {
      Time
    };
  }
};

const PathIcon = {
  template: `
    <a-icon :component="Path" />
  `,
  data() {
    return {
      Path
    };
  }
};

const LiangIcon = {
  template: `
    <a-icon :component="Liang" />
  `,
  data() {
    return {
      Liang
    };
  }
};

const LiangaddIcon = {
  template: `
    <a-icon :component="Addlinag" />
  `,
  data() {
    return {
      Addlinag
    };
  }
};

export default {
  name: "SvgIcon",
  components: {
    TimeIcon,
    PathIcon,
    LiangIcon,
    LiangaddIcon
  },
  props:['item'],
  created(){
  }
};
</script>
<style scoped>
.custom-icons-list >>> .anticon {
  margin-right: 6px;
}
</style>
