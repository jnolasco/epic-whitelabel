const _0x5eed=['RIGHT_WRIST','25577mPpGgb','activity','isInitialized','shift','centerShoulder','reduceJointToAverage','sqrt','areJointsNearPose','RIGHT_ELBOW','getSegmentHistory','215865dtMNpX','centerHip','52159IWOSCO','getSegment','lowPassDelta','minConfidence','NEGATIVE_INFINITY','106899sZmDWA','_updateAverageHistory','getJointHistory','length','part','initialize','fixJointSwap','currentPose','getFacingRatio','isFacingFront','_calculateSegments','LEFT_HIP','centerKnee','maxRawHistory','xLength','xSwapped','EARLINE','arrayId','currentAverage','joints','reduce','lagFrames','abs','slice','clearHistory','getBestJoint','keypoints','getJoint','getSegmentMaxWorldAngle','LEFT_WRIST','push','_fixJointSwap','reduceSegmentToAverage','getSegmentAngle','LEFT_SHOULDER','getSegmentMinWidth','createTime','getSegmentMinHeight','deprecated!!!','rawHistory','tensorHeight','update','tensorWidth','addSyntheticJoints','orientation','getSegmentHeight','maxAverageHistory','43601hcPwes','POSITIVE_INFINITY','7ACbNRu','timestamp','getStatus','pow','RIGHT_ANKLE','RIGHT_SHOULDER','position','_lowPassFilter','RIGHT_EYE','212MlFSZE','getSegmentWidth','telemetry\x20options:','options','yLength','getSegmentHistoryFromLength','isSegmentLevel','TOP_TORSO','score','currentPoseIndex','getJointAverageHistoryFromLength','8sHnQMa','offset','getJointHistoryFromLength','log','5rZxNIf','averageHistory','entries','pending_init','LANDSCAPE','getBestSegment','segments','FitTelemetry:\x20Created:\x20','name','RIGHT_KNEE','210448EUWmfw','getJointPosition','LEFT_ELBOW','atan2','landscape','worldAngle'];function _0x3251(_0x121c4b,_0x19b66f){return _0x3251=function(_0x5eed9f,_0x325127){_0x5eed9f=_0x5eed9f-0x15e;let _0x20420b=_0x5eed[_0x5eed9f];return _0x20420b;},_0x3251(_0x121c4b,_0x19b66f);}const _0x6ca80e=_0x3251;(function(_0x3a3b18,_0x3a4084){const _0x1cefe2=_0x3251;while(!![]){try{const _0x30b8d2=-parseInt(_0x1cefe2(0x189))+parseInt(_0x1cefe2(0x19f))*-parseInt(_0x1cefe2(0x194))+-parseInt(_0x1cefe2(0x18b))*parseInt(_0x1cefe2(0x1b4))+parseInt(_0x1cefe2(0x1c0))*parseInt(_0x1cefe2(0x1a3))+-parseInt(_0x1cefe2(0x1be))+parseInt(_0x1cefe2(0x1c5))+parseInt(_0x1cefe2(0x1ad));if(_0x30b8d2===_0x3a4084)break;else _0x3a3b18['push'](_0x3a3b18['shift']());}catch(_0x365b77){_0x3a3b18['push'](_0x3a3b18['shift']());}}}(_0x5eed,0x21ad5));import{Joints,Segments}from'../../common';import{Orientation}from'../../common';const ASPECT_RATIO_MULTIPLIER=1.77,DEFAULT_NAME=_0x6ca80e(0x1a6),DEFAULTS={'name':DEFAULT_NAME,'maxAverageHistory':Number['POSITIVE_INFINITY'],'maxRawHistory':Number[_0x6ca80e(0x18a)],'lagFrames':0x4,'lowPassDelta':0.3,'minConfidence':0.3,'fixJointSwap':![],'tensorWidth':0x12c,'tensorHeight':0x12c/ASPECT_RATIO_MULTIPLIER};export default class FitTelemetry{constructor(_0x51b2d9={}){const _0x3d52b3=_0x6ca80e;if(!_0x51b2d9['orientation'])throw'FitTelemetry:\x20orientation\x20not\x20provided.';else{const _0x57827b=_0x51b2d9[_0x3d52b3(0x186)]===Orientation[_0x3d52b3(0x1a7)]?_0x3d52b3(0x1b1):'portrait';console[_0x3d52b3(0x1a2)](_0x3d52b3(0x1aa)+_0x57827b);}return this[_0x3d52b3(0x197)]={'name':_0x51b2d9[_0x3d52b3(0x1ab)]||DEFAULTS[_0x3d52b3(0x1ab)],'maxAverageHistory':_0x51b2d9['maxAverageHistory']||DEFAULTS[_0x3d52b3(0x188)],'maxRawHistory':_0x51b2d9[_0x3d52b3(0x167)]||DEFAULTS[_0x3d52b3(0x167)],'lagFrames':_0x51b2d9[_0x3d52b3(0x16f)]||DEFAULTS[_0x3d52b3(0x16f)],'lowPassDelta':_0x51b2d9[_0x3d52b3(0x1c2)]||DEFAULTS[_0x3d52b3(0x1c2)],'minConfidence':_0x51b2d9[_0x3d52b3(0x1c3)]||DEFAULTS[_0x3d52b3(0x1c3)],'fixJointSwap':_0x51b2d9[_0x3d52b3(0x160)]||DEFAULTS[_0x3d52b3(0x160)],'orientation':_0x51b2d9[_0x3d52b3(0x186)],'tensorWidth':_0x51b2d9['tensorWidth']||DEFAULTS[_0x3d52b3(0x184)],'tensorHeight':_0x51b2d9[_0x3d52b3(0x182)]||DEFAULTS['tensorHeight']},console[_0x3d52b3(0x1a2)](_0x3d52b3(0x196)),console[_0x3d52b3(0x1a2)](this[_0x3d52b3(0x197)]),this[_0x3d52b3(0x17e)]=Date['now'](),this[_0x3d52b3(0x181)]=[],this['averageHistory']=[],this[_0x3d52b3(0x18c)]={'begin':null,'complete':null},this[_0x3d52b3(0x1b6)]=![],this;}get['currentPose'](){const _0x592ff6=_0x6ca80e;if(this[_0x592ff6(0x181)][_0x592ff6(0x1c8)]===0x0)return{};return this[_0x592ff6(0x181)][this[_0x592ff6(0x181)][_0x592ff6(0x1c8)]-0x1];}get[_0x6ca80e(0x19d)](){const _0x2f30d0=_0x6ca80e;return this[_0x2f30d0(0x181)][_0x2f30d0(0x1c8)]-0x1;}get[_0x6ca80e(0x16c)](){const _0x465640=_0x6ca80e;if(this[_0x465640(0x1a4)][_0x465640(0x1c8)]===0x0)return this[_0x465640(0x161)];return this['averageHistory'][this[_0x465640(0x1a4)][_0x465640(0x1c8)]-0x1];}[_0x6ca80e(0x15f)](_0x341807){const _0x4295a8=_0x6ca80e;throw _0x4295a8(0x180);const {tensorWidth:_0xa8f3f5,tensorHeight:_0x10a793}=this[_0x4295a8(0x197)];if(this[_0x4295a8(0x1b6)])throw'FitTelemetry\x20object\x20already\x20isInitialized.';if(!_0x341807)throw'FitTelemetry.initialize():\x20activity\x20null\x20or\x20undefined.';this[_0x4295a8(0x1b5)]=_0x341807,this[_0x4295a8(0x1b5)]['createBoundingBox'](_0xa8f3f5,_0x10a793),this['isInitialized']=!![];}['getPose'](_0x1ca859){const _0x399808=_0x6ca80e;return _0x1ca859<this[_0x399808(0x181)]['length']-0x1?this[_0x399808(0x181)][_0x1ca859]:[];}['getAverage'](_0x40b141){const _0x48f897=_0x6ca80e;return _0x40b141<this[_0x48f897(0x1a4)]['length']-0x1?this[_0x48f897(0x1a4)][_0x40b141]:[];}['_fixJointSwap'](_0x26d11d){const _0x4b77e9=_0x6ca80e,_0xc55118=_0x26d11d,_0x7e4d4a=Joints[_0x4b77e9(0x1ac)]['id'],_0x38bf70=Joints['LEFT_KNEE']['id'],_0x692488=Joints[_0x4b77e9(0x1bc)]['id'],_0x18ac88=Joints[_0x4b77e9(0x1af)]['id'],_0x38250d=Joints[_0x4b77e9(0x177)]['id'],_0x2199cc=Joints[_0x4b77e9(0x1b3)]['id'],_0x4edac1=Joints['LEFT_ANKLE']['id'],_0x9bef26=Joints['RIGHT_ANKLE']['id'],_0x71f43e=Joints['LEFT_EYE']['id'],_0x106a15=Joints[_0x4b77e9(0x193)]['id'];return _0xc55118[_0x38bf70]['position']['x']<_0xc55118[_0x7e4d4a]['position']['x']&&([_0xc55118[_0x38bf70][_0x4b77e9(0x191)]['x'],_0xc55118[_0x7e4d4a][_0x4b77e9(0x191)]['x']]=[_0xc55118[_0x7e4d4a][_0x4b77e9(0x191)]['x'],_0xc55118[_0x38bf70][_0x4b77e9(0x191)]['x']],_0xc55118[_0x38bf70][_0x4b77e9(0x169)]=!![],_0xc55118[_0x7e4d4a]['xSwapped']=!![]),_0xc55118[_0x18ac88][_0x4b77e9(0x191)]['x']<_0xc55118[_0x692488]['position']['x']&&([_0xc55118[_0x18ac88][_0x4b77e9(0x191)]['x'],_0xc55118[_0x692488][_0x4b77e9(0x191)]['x']]=[_0xc55118[_0x692488][_0x4b77e9(0x191)]['x'],_0xc55118[_0x18ac88][_0x4b77e9(0x191)]['x']],_0xc55118[_0x18ac88]['xSwapped']=!![],_0xc55118[_0x692488][_0x4b77e9(0x169)]=!![]),_0xc55118[_0x38250d][_0x4b77e9(0x191)]['x']<_0xc55118[_0x106a15][_0x4b77e9(0x191)]['x']&&(_0xc55118[_0x38250d][_0x4b77e9(0x19c)]/=0x2),_0xc55118[_0x2199cc][_0x4b77e9(0x191)]['x']>_0xc55118[_0x71f43e][_0x4b77e9(0x191)]['x']&&(_0xc55118[_0x2199cc]['score']/=0x2),_0xc55118[_0x4edac1][_0x4b77e9(0x191)]['x']<_0xc55118[_0x106a15]['position']['x']&&(_0xc55118[_0x4edac1][_0x4b77e9(0x19c)]/=0x2),_0xc55118[_0x9bef26][_0x4b77e9(0x191)]['x']>_0xc55118[_0x71f43e][_0x4b77e9(0x191)]['x']&&(_0xc55118[_0x9bef26][_0x4b77e9(0x19c)]/=0x2),_0xc55118;}[_0x6ca80e(0x192)](_0xa87fae){const _0x204706=_0x6ca80e,_0x2cb22a=this[_0x204706(0x16c)];if(_0x2cb22a&&_0x2cb22a[0x0]){const {lowPassDelta:_0x442235,tensorWidth:_0x3d8e18,tensorHeight:_0x3a3dd1}=this[_0x204706(0x197)],_0x1a9fe8=_0x3d8e18*_0x442235,_0x22552b=_0x3a3dd1*_0x442235;for(const [_0x1064b9,_0x2ae181]of Object[_0x204706(0x1a5)](Joints)){const _0x32fa8a=_0x2ae181['id'];_0xa87fae[_0x32fa8a]['position']['x']=Math[_0x204706(0x170)](_0xa87fae[_0x32fa8a][_0x204706(0x191)]['x']-_0x2cb22a[_0x32fa8a][_0x204706(0x191)]['x'])<_0x1a9fe8?_0xa87fae[_0x32fa8a][_0x204706(0x191)]['x']:_0x2cb22a[_0x32fa8a][_0x204706(0x191)]['x'],_0xa87fae[_0x32fa8a][_0x204706(0x191)]['y']=Math[_0x204706(0x170)](_0xa87fae[_0x32fa8a][_0x204706(0x191)]['y']-_0x2cb22a[_0x32fa8a]['position']['y'])<_0x22552b?_0xa87fae[_0x32fa8a][_0x204706(0x191)]['y']:_0x2cb22a[_0x32fa8a]['position']['y'];}}else{}return _0xa87fae;}[_0x6ca80e(0x164)](_0x29d3d3){const _0x10392a=_0x6ca80e,_0x5d2676=0xc8;let _0xba6b7c=[];const {minConfidence:_0x46f888}=this[_0x10392a(0x197)];for(const [_0x39dd4f,_0x510735]of Object[_0x10392a(0x1a5)](Segments)){const _0x59dfec=_0x29d3d3[_0x510735['j1']['id']],_0x16cbde=_0x29d3d3[_0x510735['j2']['id']];_0xba6b7c[_0x510735['id']-_0x5d2676]={'part':_0x510735['name'],'position':{'j1':{'x':_0x59dfec[_0x10392a(0x191)]['x'],'y':_0x59dfec[_0x10392a(0x191)]['y']},'j2':{'x':_0x16cbde[_0x10392a(0x191)]['x'],'y':_0x16cbde[_0x10392a(0x191)]['y']}},'xLength':Math[_0x10392a(0x170)](_0x59dfec[_0x10392a(0x191)]['x']-_0x16cbde[_0x10392a(0x191)]['x']),'yLength':Math[_0x10392a(0x170)](_0x59dfec[_0x10392a(0x191)]['y']-_0x16cbde[_0x10392a(0x191)]['y']),'worldAngle':Math[_0x10392a(0x170)](Math[_0x10392a(0x1b0)](_0x59dfec['position']['x']-_0x16cbde[_0x10392a(0x191)]['x'],_0x59dfec[_0x10392a(0x191)]['y']-_0x16cbde[_0x10392a(0x191)]['y'])*0xb4/Math['PI']),'length':Math[_0x10392a(0x1ba)](Math[_0x10392a(0x18e)](_0x59dfec['position']['x']-_0x16cbde[_0x10392a(0x191)]['x'],0x2)+Math[_0x10392a(0x18e)](_0x59dfec['position']['y']-_0x16cbde[_0x10392a(0x191)]['y'],0x2)),'score':_0x59dfec['score']<_0x16cbde[_0x10392a(0x19c)]?_0x59dfec[_0x10392a(0x19c)]:_0x16cbde[_0x10392a(0x19c)]};}return _0xba6b7c;}['_updateRawHistory'](_0x541f83){const _0x58b985=_0x6ca80e;if(this[_0x58b985(0x181)][_0x58b985(0x1c8)]===this[_0x58b985(0x197)]['maxRawHistory'])this[_0x58b985(0x181)][_0x58b985(0x1b7)]();this[_0x58b985(0x181)][_0x58b985(0x178)](_0x541f83);}[_0x6ca80e(0x1a1)](_0x2008c3,_0x284cfa){const _0x5725af=_0x6ca80e,_0x3630f7=this[_0x5725af(0x181)][_0x5725af(0x1c8)]-0x1,_0x301aeb=_0x2008c3>_0x3630f7?this['rawHistory']:this['rawHistory'][_0x5725af(0x171)](_0x3630f7-_0x2008c3,_0x3630f7);return this[_0x5725af(0x1c7)](_0x301aeb,_0x284cfa);}[_0x6ca80e(0x19e)](_0x2241ff,_0x3889ef){const _0x99b205=_0x6ca80e,_0x2a9c62=this[_0x99b205(0x1a4)][_0x99b205(0x1c8)]-0x1,_0x10ff52=_0x2241ff>_0x2a9c62?this[_0x99b205(0x1a4)]:this['averageHistory'][_0x99b205(0x171)](_0x2a9c62-_0x2241ff,_0x2a9c62);return this[_0x99b205(0x1c7)](_0x10ff52,_0x3889ef);}[_0x6ca80e(0x1c7)](_0x37dd03,_0x1f9714){const _0x21f54f=_0x6ca80e;let _0x1cf4c0={'part':'','position':{'x':[],'y':[]},'score':[]};return _0x37dd03[_0x21f54f(0x1c8)]>0x0&&(_0x1cf4c0=_0x37dd03['reduce']((_0x5c9e45,_0x1d5831)=>{const _0x5f0ed8=_0x21f54f;return(!![]||_0x1d5831['joints'][_0x1f9714][_0x5f0ed8(0x19c)]>this[_0x5f0ed8(0x197)][_0x5f0ed8(0x1c3)])&&(_0x5c9e45[_0x5f0ed8(0x191)]['x'][_0x5f0ed8(0x178)](parseFloat(_0x1d5831['joints'][_0x1f9714][_0x5f0ed8(0x191)]['x'])),_0x5c9e45['position']['y'][_0x5f0ed8(0x178)](_0x1d5831['joints'][_0x1f9714][_0x5f0ed8(0x191)]['y']),_0x5c9e45[_0x5f0ed8(0x19c)][_0x5f0ed8(0x178)](_0x1d5831['joints'][_0x1f9714][_0x5f0ed8(0x19c)])),_0x5c9e45;},_0x1cf4c0),_0x1cf4c0['part']=_0x37dd03[0x0][_0x21f54f(0x16d)][_0x1f9714][_0x21f54f(0x15e)]),_0x1cf4c0;}[_0x6ca80e(0x199)](_0x254fbc,_0x1a2595){const _0x322042=_0x6ca80e,_0x57bc41=this[_0x322042(0x181)]['length']-0x1,_0x437a18=_0x254fbc>_0x57bc41?this[_0x322042(0x181)]:this[_0x322042(0x181)][_0x322042(0x171)](_0x57bc41-_0x254fbc,_0x57bc41);return this[_0x322042(0x1bd)](_0x437a18,_0x1a2595);}['getSegmentAverageHistoryFromLength'](_0x34a407,_0x341f6d){const _0x31ba82=_0x6ca80e,_0x164a37=this['averageHistory'][_0x31ba82(0x1c8)]-0x1,_0x19566a=_0x34a407>_0x164a37?this[_0x31ba82(0x1a4)]:this[_0x31ba82(0x1a4)][_0x31ba82(0x171)](_0x164a37-_0x34a407,_0x164a37);return this[_0x31ba82(0x1bd)](_0x19566a,_0x341f6d);}[_0x6ca80e(0x1bb)](_0x3c6d75,_0xc451f1,_0x108ef7=0.05,_0x2d87e7=![]){const _0x106425=_0x6ca80e,_0x3fbb51=_0x2d87e7?this[_0x106425(0x16c)][_0x106425(0x16d)]:this['currentPose'][_0x106425(0x16d)],{tensorWidth:_0x538390,tensorHeight:_0x5d1f94}=this['options'];return _0x3c6d75[_0x106425(0x16e)]((_0x4fd11f,_0x2f5940)=>{const _0x5f5cd5=_0x106425,_0x2aedd0=_0x3fbb51[_0x2f5940['id']],_0x210e38=_0xc451f1[_0x2f5940['id']];return _0x4fd11f&&(Math['abs'](_0x2aedd0[_0x5f5cd5(0x191)]['x']-_0x210e38[_0x5f5cd5(0x191)]['x'])/_0x538390<_0x108ef7&&Math[_0x5f5cd5(0x170)](_0x2aedd0[_0x5f5cd5(0x191)]['y']-_0x210e38[_0x5f5cd5(0x191)]['y'])/_0x5d1f94<_0x108ef7);},!![]),Math[_0x106425(0x170)](p1['x']-p2['x'])/this['options'][_0x106425(0x184)]<_0x108ef7&&Math['abs'](p1['y']-p2['y'])/this['options'][_0x106425(0x182)]<_0x108ef7;}[_0x6ca80e(0x1bd)](_0xf60401,_0x5e4ea5){const _0x13587f=_0x6ca80e;let _0x32fabf={'part':'','position':{'j1':{'x':[],'y':[]},'j2':{'x':[],'y':[]}},'xLength':[],'yLength':[],'worldAngle':[],'length':[],'score':[]};return _0xf60401[_0x13587f(0x1c8)]>0x0&&(_0x32fabf=_0xf60401[_0x13587f(0x16e)]((_0x4bcafe,_0x3245f1)=>{const _0x28ff44=_0x13587f,_0x59cae2=_0x3245f1[_0x28ff44(0x1a9)][_0x5e4ea5];return _0x4bcafe[_0x28ff44(0x191)]['j1']['x'][_0x28ff44(0x178)](parseFloat(_0x59cae2[_0x28ff44(0x191)]['j1']['x'])),_0x4bcafe[_0x28ff44(0x191)]['j1']['y'][_0x28ff44(0x178)](_0x59cae2[_0x28ff44(0x191)]['j1']['y']),_0x4bcafe[_0x28ff44(0x191)]['j2']['x'][_0x28ff44(0x178)](parseFloat(_0x59cae2['position']['j2']['x'])),_0x4bcafe[_0x28ff44(0x191)]['j2']['y']['push'](_0x59cae2[_0x28ff44(0x191)]['j2']['y']),_0x4bcafe['xLength'][_0x28ff44(0x178)](_0x59cae2[_0x28ff44(0x168)]),_0x4bcafe[_0x28ff44(0x198)][_0x28ff44(0x178)](_0x59cae2['yLength']),_0x4bcafe[_0x28ff44(0x1b2)]['push'](_0x59cae2[_0x28ff44(0x1b2)]),_0x4bcafe[_0x28ff44(0x1c8)][_0x28ff44(0x178)](_0x59cae2[_0x28ff44(0x1c8)]),_0x4bcafe[_0x28ff44(0x19c)][_0x28ff44(0x178)](_0x59cae2[_0x28ff44(0x19c)]),_0x4bcafe;},_0x32fabf),_0x32fabf['part']=_0xf60401[0x0]['segments'][_0x5e4ea5][_0x13587f(0x15e)]),_0x32fabf;}['reduceJointToAverage'](_0xeac5b1){const _0x2b767e=_0x6ca80e,_0x5b338c=_0xeac5b1[_0x2b767e(0x19c)]['length'],_0xd2d672=_0xeac5b1[_0x2b767e(0x19c)][_0x2b767e(0x16e)]((_0x91143,_0x1d9eee)=>{return _0x91143+_0x1d9eee;});return{'part':_0xeac5b1[_0x2b767e(0x15e)],'position':{'x':_0xeac5b1[_0x2b767e(0x191)]['x']['reduce']((_0x59bc8d,_0xf98424,_0x25630e)=>{return _0x59bc8d+_0xf98424*(_0xeac5b1['score'][_0x25630e]/_0xd2d672);},0x0),'y':_0xeac5b1[_0x2b767e(0x191)]['y'][_0x2b767e(0x16e)]((_0x7097b4,_0x4c8b91,_0x2d2f71)=>{const _0x163c85=_0x2b767e;return _0x7097b4+_0x4c8b91*(_0xeac5b1[_0x163c85(0x19c)][_0x2d2f71]/_0xd2d672);},0x0)},'score':_0xeac5b1[_0x2b767e(0x19c)]['reduce']((_0x25b228,_0x4bb967)=>{return _0x25b228+_0x4bb967;})/_0x5b338c};}[_0x6ca80e(0x17a)](_0x893aae){const _0x55b6bf=_0x6ca80e,_0x541a27=_0x893aae[_0x55b6bf(0x19c)][_0x55b6bf(0x1c8)],_0x358e5b=_0x893aae[_0x55b6bf(0x19c)][_0x55b6bf(0x16e)]((_0x2e4c0b,_0x21fd7b)=>{return _0x2e4c0b+_0x21fd7b;});return{'part':_0x893aae[_0x55b6bf(0x15e)],'position':{'j1':{'x':_0x893aae[_0x55b6bf(0x191)]['j1']['x'][_0x55b6bf(0x16e)]((_0x1103ab,_0x3c713f,_0x49091f)=>{const _0x2f62be=_0x55b6bf;return _0x1103ab+_0x3c713f*(_0x893aae[_0x2f62be(0x19c)][_0x49091f]/_0x358e5b);},0x0),'y':_0x893aae[_0x55b6bf(0x191)]['j1']['y'][_0x55b6bf(0x16e)]((_0xbc97ff,_0x21cca1,_0x39030a)=>{const _0x22b108=_0x55b6bf;return _0xbc97ff+_0x21cca1*(_0x893aae[_0x22b108(0x19c)][_0x39030a]/_0x358e5b);},0x0)},'j2':{'x':_0x893aae['position']['j2']['x']['reduce']((_0x3fcb60,_0x4d1930,_0x3045bd)=>{return _0x3fcb60+_0x4d1930*(_0x893aae['score'][_0x3045bd]/_0x358e5b);},0x0),'y':_0x893aae[_0x55b6bf(0x191)]['j2']['y'][_0x55b6bf(0x16e)]((_0x1e20ca,_0x3240d6,_0x499e70)=>{return _0x1e20ca+_0x3240d6*(_0x893aae['score'][_0x499e70]/_0x358e5b);},0x0)}},'xLength':_0x893aae[_0x55b6bf(0x168)][_0x55b6bf(0x16e)]((_0x133386,_0x16d80a,_0x24ee3a)=>{const _0x544287=_0x55b6bf;return _0x133386+_0x16d80a*(_0x893aae[_0x544287(0x19c)][_0x24ee3a]/_0x358e5b);},0x0),'yLength':_0x893aae['yLength'][_0x55b6bf(0x16e)]((_0x668bfa,_0xba21e3,_0x119859)=>{const _0x4672aa=_0x55b6bf;return _0x668bfa+_0xba21e3*(_0x893aae[_0x4672aa(0x19c)][_0x119859]/_0x358e5b);},0x0),'worldAngle':_0x893aae[_0x55b6bf(0x1b2)][_0x55b6bf(0x16e)]((_0x38d80b,_0x35fc79,_0x1f30a3)=>{const _0x5a1efe=_0x55b6bf;return _0x38d80b+_0x35fc79*(_0x893aae[_0x5a1efe(0x19c)][_0x1f30a3]/_0x358e5b);},0x0),'length':_0x893aae['length'][_0x55b6bf(0x16e)]((_0x1026db,_0x579f18,_0xe7e05c)=>{return _0x1026db+_0x579f18*(_0x893aae['score'][_0xe7e05c]/_0x358e5b);},0x0),'score':_0x893aae['score'][_0x55b6bf(0x16e)]((_0x2b152c,_0x3f199c)=>{return _0x2b152c+_0x3f199c;})/_0x541a27};}[_0x6ca80e(0x1c6)](){const _0x46b5d2=_0x6ca80e,_0x42d7a3=[],_0x2106ae=[],{lagFrames:_0x13137b,minConfidence:_0x2af6d6}=this['options'],_0x46be13=this['rawHistory'][_0x46b5d2(0x1c8)]-0x1,_0x5abbef=this[_0x46b5d2(0x181)][_0x46b5d2(0x171)](_0x46be13-_0x13137b,_0x46be13);for(const [_0x495319,_0x538b95]of Object[_0x46b5d2(0x1a5)](Joints)){const _0xcd755a=_0x538b95['id'];let _0x4ecf4e={'position':{'x':0x0,'y':0x0},'score':0x0},_0x3dcc17=this[_0x46b5d2(0x1c7)](_0x5abbef,_0xcd755a);_0x4ecf4e=this[_0x46b5d2(0x1b9)](_0x3dcc17),_0x42d7a3[_0x46b5d2(0x178)](_0x4ecf4e);}for(const [_0x5eeca7,_0x1b0dec]of Object[_0x46b5d2(0x1a5)](Segments)){const _0x55ee0d=0xc8,_0x5e4301=_0x1b0dec['id']-_0x55ee0d;let _0x173cf2=this[_0x46b5d2(0x1bd)](_0x5abbef,_0x5e4301),_0x52fe68=this[_0x46b5d2(0x17a)](_0x173cf2);_0x2106ae[_0x46b5d2(0x178)](_0x52fe68);}if(this[_0x46b5d2(0x1a4)][_0x46b5d2(0x1c8)]===this['options'][_0x46b5d2(0x188)])this['averageHistory'][_0x46b5d2(0x1b7)]();this[_0x46b5d2(0x1a4)][_0x46b5d2(0x178)]({'offset':this[_0x46b5d2(0x161)][_0x46b5d2(0x1a0)],'joints':_0x42d7a3,'segments':_0x2106ae});}[_0x6ca80e(0x185)](_0x90a296){const _0x8fad34=_0x6ca80e,_0x15eb4e=_0x90a296[Joints[_0x8fad34(0x190)]['id']],_0x3be2cd=_0x90a296[Joints[_0x8fad34(0x17c)]['id']];_0x90a296[_0x8fad34(0x178)]({'name':_0x8fad34(0x1b8),'score':(_0x15eb4e['score']+_0x3be2cd[_0x8fad34(0x19c)])/0x2,'position':{'x':(_0x3be2cd[_0x8fad34(0x191)]['x']+_0x15eb4e[_0x8fad34(0x191)]['x'])/0x2,'y':(_0x3be2cd[_0x8fad34(0x191)]['y']+_0x15eb4e[_0x8fad34(0x191)]['y'])/0x2}});const _0x71919b=_0x90a296[Joints['RIGHT_HIP']['id']],_0x4acfb8=_0x90a296[Joints[_0x8fad34(0x165)]['id']];_0x90a296[_0x8fad34(0x178)]({'name':_0x8fad34(0x1bf),'score':(_0x71919b[_0x8fad34(0x19c)]+_0x4acfb8[_0x8fad34(0x19c)])/0x2,'position':{'x':(_0x4acfb8[_0x8fad34(0x191)]['x']+_0x71919b['position']['x'])/0x2,'y':(_0x4acfb8[_0x8fad34(0x191)]['y']+_0x71919b[_0x8fad34(0x191)]['y'])/0x2}});const _0x5405d9=_0x90a296[Joints['RIGHT_KNEE']['id']],_0x4e5371=_0x90a296[Joints['LEFT_KNEE']['id']];_0x90a296['push']({'name':_0x8fad34(0x166),'score':(_0x5405d9['score']+_0x4e5371[_0x8fad34(0x19c)])/0x2,'position':{'x':(_0x4e5371[_0x8fad34(0x191)]['x']+_0x5405d9[_0x8fad34(0x191)]['x'])/0x2,'y':(_0x4e5371[_0x8fad34(0x191)]['y']+_0x5405d9['position']['y'])/0x2}});const _0x2f8fdd=_0x90a296[Joints[_0x8fad34(0x18f)]['id']],_0x21198c=_0x90a296[Joints['LEFT_ANKLE']['id']];return _0x90a296[_0x8fad34(0x178)]({'name':'centerAnkle','score':(_0x2f8fdd[_0x8fad34(0x19c)]+_0x21198c['score'])/0x2,'position':{'x':(_0x21198c[_0x8fad34(0x191)]['x']+_0x2f8fdd[_0x8fad34(0x191)]['x'])/0x2,'y':(_0x21198c['position']['y']+_0x2f8fdd[_0x8fad34(0x191)]['y'])/0x2}}),_0x90a296;}['rawInput'](_0x550998,_0x55cb79){const _0x3556e3=_0x6ca80e;let _0x3d6e0c=_0x550998[_0x3556e3(0x174)];_0x3d6e0c=this[_0x3556e3(0x185)](_0x3d6e0c);let {fixJointSwap:_0x4b5fca}=this['options'];_0x4b5fca&&(_0x3d6e0c=this[_0x3556e3(0x179)](_0x3d6e0c));let _0x43b9a5=this['_calculateSegments'](_0x3d6e0c);const _0x242557={'score':_0x550998[_0x3556e3(0x19c)],'duration':_0x55cb79,'offset':Date['now']()-this[_0x3556e3(0x17e)],'joints':_0x3d6e0c,'segments':_0x43b9a5};this['_updateRawHistory'](_0x242557),this[_0x3556e3(0x181)][_0x3556e3(0x1c8)]>this['options'][_0x3556e3(0x16f)]&&this[_0x3556e3(0x1c6)]();}['updateActivity'](){const _0x11b777=_0x6ca80e;throw'updateactivity\x20deprecated!';if(this['isInitialized']){const {activity:_0x34921d}=this;_0x34921d[_0x11b777(0x183)]();const _0x17dc35=_0x34921d[_0x11b777(0x18d)]();}}[_0x6ca80e(0x183)](_0x316db7,_0x289d54=0x0){this['rawInput'](_0x316db7,_0x289d54);}[_0x6ca80e(0x172)](){const _0x444617=_0x6ca80e;this[_0x444617(0x181)]=[],this[_0x444617(0x1a4)]=[];}[_0x6ca80e(0x1c1)](_0x3897f5){const _0x32c851=_0x6ca80e;return this[_0x32c851(0x16c)][_0x32c851(0x1a9)][_0x3897f5[_0x32c851(0x16b)]];}[_0x6ca80e(0x187)](_0x1caff4){const _0x4b0fea=_0x6ca80e;return this[_0x4b0fea(0x16c)][_0x4b0fea(0x1a9)][_0x1caff4[_0x4b0fea(0x16b)]][_0x4b0fea(0x198)];}[_0x6ca80e(0x195)](_0x1728d1){const _0x1b2cd9=_0x6ca80e;return this[_0x1b2cd9(0x16c)][_0x1b2cd9(0x1a9)][_0x1728d1['arrayId']][_0x1b2cd9(0x168)];}['getSegmentAngle'](_0x3d96b5){const _0x44b37b=_0x6ca80e;return this[_0x44b37b(0x16c)][_0x44b37b(0x1a9)][_0x3d96b5[_0x44b37b(0x16b)]][_0x44b37b(0x1b2)];}['getSegmentMaxHeight'](_0x705794,_0x310499){const _0x2370ed=_0x6ca80e,_0x2ebf52=this['rawHistory']['slice'](_0x310499);return _0x2ebf52[_0x2370ed(0x16e)]((_0x574a81,_0x2e8ff1)=>{const _0x106c63=_0x2370ed,_0x1d0cc4=_0x2e8ff1[_0x106c63(0x1a9)][_0x705794['arrayId']]['yLength'];return _0x1d0cc4>_0x574a81?_0x1d0cc4:_0x574a81;},Number[_0x2370ed(0x1c4)]);}[_0x6ca80e(0x17f)](_0x6bef92,_0x4ea2e0){const _0x2fea21=_0x6ca80e,_0x3f6e90=this[_0x2fea21(0x181)][_0x2fea21(0x171)](_0x4ea2e0);return _0x3f6e90['reduce']((_0x281194,_0x5bed70)=>{const _0x4249b8=_0x2fea21,_0x5e9f9e=_0x5bed70[_0x4249b8(0x1a9)][_0x6bef92[_0x4249b8(0x16b)]][_0x4249b8(0x198)];return _0x5e9f9e<_0x281194?_0x5e9f9e:_0x281194;},Number[_0x2fea21(0x18a)]);}['getSegmentMaxWidth'](_0x52aad7,_0x13fc33){const _0x49a8dd=_0x6ca80e,_0x271426=this[_0x49a8dd(0x181)][_0x49a8dd(0x171)](_0x13fc33);return _0x271426[_0x49a8dd(0x16e)]((_0x4d0703,_0xb7a304)=>{const _0x1eb4d3=_0x49a8dd,_0x239c52=_0xb7a304['segments'][_0x52aad7[_0x1eb4d3(0x16b)]][_0x1eb4d3(0x168)];return _0x239c52>_0x4d0703?_0x239c52:_0x4d0703;},Number[_0x49a8dd(0x1c4)]);}[_0x6ca80e(0x17d)](_0x46d7af,_0x562b49){const _0x4bde3f=_0x6ca80e,_0x9e6e1b=this[_0x4bde3f(0x181)][_0x4bde3f(0x171)](_0x562b49);return _0x9e6e1b[_0x4bde3f(0x16e)]((_0x13aae8,_0x1023ec)=>{const _0x495c00=_0x4bde3f,_0xc6125a=_0x1023ec['segments'][_0x46d7af[_0x495c00(0x16b)]][_0x495c00(0x168)];return _0xc6125a<_0x13aae8?_0xc6125a:_0x13aae8;},Number[_0x4bde3f(0x18a)]);}[_0x6ca80e(0x176)](_0x318625,_0x16747e){const _0x4c697c=_0x6ca80e,_0x1121ec=this[_0x4c697c(0x1a4)]['slice'](_0x16747e);return _0x1121ec[_0x4c697c(0x16e)]((_0x5dd669,_0x1dc65a)=>{const _0x439850=_0x4c697c,_0x4c01ef=_0x1dc65a[_0x439850(0x1a9)][_0x318625[_0x439850(0x16b)]][_0x439850(0x1b2)];return _0x4c01ef>_0x5dd669?_0x4c01ef:_0x5dd669;},Number[_0x4c697c(0x1c4)]);}['getSegmentMinWorldAngle'](_0x2d3c4a,_0x274787){const _0x551ae0=_0x6ca80e,_0x2e3d88=this[_0x551ae0(0x1a4)][_0x551ae0(0x171)](_0x274787);return _0x2e3d88['reduce']((_0x372aed,_0x499144)=>{const _0x3ad099=_0x551ae0,_0x30fdc6=_0x499144['segments'][_0x2d3c4a[_0x3ad099(0x16b)]][_0x3ad099(0x1b2)];return _0x30fdc6<_0x372aed?_0x30fdc6:_0x372aed;},Number[_0x551ae0(0x18a)]);}[_0x6ca80e(0x175)](_0x1ef36d){const _0x38b55a=_0x6ca80e;return this[_0x38b55a(0x16c)][_0x38b55a(0x16d)][_0x1ef36d['id']];}[_0x6ca80e(0x173)](_0x3651ff,_0x1623a8){const _0x238181=_0x6ca80e,_0xd2e4bb=this[_0x238181(0x175)](_0x3651ff),_0x5184ba=this[_0x238181(0x175)](_0x1623a8);return _0xd2e4bb['score']>_0x5184ba[_0x238181(0x19c)]?_0xd2e4bb:_0x5184ba;}[_0x6ca80e(0x1c1)](_0x151337){const _0x23db16=_0x6ca80e;return this['currentAverage'][_0x23db16(0x1a9)][_0x151337[_0x23db16(0x16b)]];}[_0x6ca80e(0x1a8)](_0x1fcff3,_0x273a3b){const _0x42b692=_0x6ca80e,_0x48896e=this[_0x42b692(0x1c1)](_0x1fcff3),_0x1c3203=this[_0x42b692(0x1c1)](_0x273a3b);return _0x48896e[_0x42b692(0x19c)]>_0x1c3203['score']?_0x48896e:_0x1c3203;}[_0x6ca80e(0x1ae)](_0x25d8d2){const _0x2fe2cf=_0x6ca80e;return this[_0x2fe2cf(0x175)](_0x25d8d2)[_0x2fe2cf(0x191)];}[_0x6ca80e(0x162)](){const _0x14a1c5=_0x6ca80e,_0x20bc27=this[_0x14a1c5(0x195)](Segments[_0x14a1c5(0x19b)]),_0x4b073f=this[_0x14a1c5(0x195)](Segments[_0x14a1c5(0x16a)]);return _0x20bc27/_0x4b073f;}[_0x6ca80e(0x163)](){const _0x7059e5=_0x6ca80e,_0x278e45=this['getSegmentWidth'](Segments['TOP_TORSO']),_0x57f437=this[_0x7059e5(0x195)](Segments[_0x7059e5(0x16a)]);return _0x278e45/_0x57f437>1.7;}[_0x6ca80e(0x19a)](_0x4d2af0){const _0x62bf24=_0x6ca80e,_0x267756=Math['abs'](this[_0x62bf24(0x17b)](_0x4d2af0));return _0x267756>0x50&&_0x267756<0x64;}['isInRange'](_0x5ecf44,_0x4268b9,_0x3b7ac9){const _0x44ad18=_0x4268b9-_0x3b7ac9,_0xca46f2=_0x4268b9+_0x3b7ac9;return _0x5ecf44>_0x44ad18&&_0x5ecf44<_0xca46f2;}}