/**
 * 首页
 */
$(function(){
	analysisDistribution.init();
	//每5秒刷新
	setInterval(function(){
		analysisDistribution.init();
	},5000);
});
var analysisDistribution = {
	/**
	 * 初始化
	 */
	init:function(){
		var self=this;
		$.getJSON(server_url+"/shipefficiencyanalysis",function(data){
			if(data.state){
				self.setDomTextByValues("totalPowerInput",data.result.totalPowerInput,data.result.stdTotalPowerInput);//总能源输入
				self.setDomTextByValues("efficiencyMe",data.result.efficiencyMe,data.result.stdEfficiencyMe);//利用率（主机）
				self.setDomTextByValues("efficiencyGe",data.result.efficiencyGe,data.result.stdEfficiencyGe);//利用率（副机）
				self.setDomTextByValues("efficiencyExh",data.result.efficiencyExh,data.result.stdEfficiencyExh);//利用率（废气锅炉）
				self.setDomTextByValues("efficiencyAux",data.result.efficiencyAux,data.result.stdEfficiencyAux);//利用率（燃油锅炉）
				self.setDomTextByValues("meOtherLoss",data.result.meOtherLoss,data.result.stdMeOtherLoss);//其他损失   缺失
				self.setDomTextByValues("meExhgas",data.result.meExhgas,data.result.stdMeExhgas);//主机（排烟）
				self.setDomTextByValues("meTransmission",data.result.meTransmission,data.result.stdMeTransmission);//传动系统  缺失
				self.setDomTextByValues("meCoolingLoss",data.result.meCoolingLoss,data.result.stdMeCoolingLoss);//主机（冷却损失）
				
				self.setDomTextByValues("geOtherLoss",data.result.geOtherLoss,data.result.stdGeOtherLoss);//副机（其他损失）
				
				self.setDomTextByValues("geExhgas",data.result.geExhgas,data.result.stdGeExhgas);//副机（排烟）
				self.setDomTextByValues("geShipPowerSystem",data.result.geShipPowerSystem,data.result.stdGeShipPowerSystem);//副机（船舶电网）
				self.setDomTextByValues("geCoolingloss",data.result.geCoolingloss,data.result.stdGeCoolingloss);//副机（冷却损失）
				self.setDomTextByValues("boilerSteamline",data.result.boilerSteamline,data.result.stdBoilerSteamline);//燃油锅炉（蒸汽管路）
				self.setDomTextByValues("boilerHeatLoss",data.result.boilerHeatLoss,data.result.stdBoilerHeatLoss);//燃油锅炉（锅炉热量损失）
				self.setDomTextByValues("otherequipmentEnergyLoss",data.result.otherequipmentEnergyLoss,data.result.stdOtherequipmentEnergyLoss);//其他初级耗能(能量损失)
				self.setDomTextByValues("meExhgasLoss",data.result.meExhgasLoss,data.result.stdMeExhgasLoss);//主机（排烟）(排烟损失)
				
				self.setDomTextByValues("mePropeller",data.result.mePropeller,data.result.stdMePropeller);//主机（传动系统）(螺旋桨)
				self.setDomTextByValues("meTransmissionLoss",data.result.meTransmissionLoss,data.result.stdMeTransmissionLoss);//主机（传动系统）(传动损失)
				
				self.setDomTextByValues("geExhgasLoss",data.result.geExhgasLoss,data.result.stdGeExhgasLoss);//副机（排烟）(排烟损失)
				self.setDomTextByValues("geElectricalLoad",data.result.geElectricalLoad,data.result.stdGeElectricalLoad);//副机（船舶电网）(电力负载)
				self.setDomTextByValues("geElectrifiedWireNettingLoss",data.result.geElectrifiedWireNettingLoss,data.result.stdGeElectrifiedWireNettingLoss);//副机（船舶电网）(电网损失)
				
				self.setDomTextByValues("boilerSteamLoad",data.result.boilerSteamLoad,data.result.stdBoilerSteamLoad);//燃油锅炉（蒸汽负载）
				self.setDomTextByValues("boilerPipelineHeatLoss",data.result.boilerPipelineHeatLoss,data.result.stdBoilerPipelineHeatLoss);//燃油锅炉（管路热量损失）
				
				self.setDomTextByValues("mePropulsionLoss",data.result.mePropulsionLoss,data.result.stdMePropulsionLoss);//主机（传动系统）(推进损失)
				self.setDomTextByValues("geElectricalLoadLoss",data.result.geElectricalLoadLoss,data.result.stdGeElectricalLoadLoss);//副机（船舶电网）(负载损失)
				
				self.setDomTextByValues("boilerLoadLoss",data.result.boilerLoadLoss,data.result.stdBoilerLoadLoss);//燃油锅炉（负载损失）
				
				self.setDomTextByValues("geExhgasCollectionPower",data.result.geExhgasCollectionPower,data.result.stdGeExhgasCollectionPower);//副机（排烟）(副机T/C回收)
				self.setDomTextByValues("meExhgasCollectionPower",data.result.meExhgasCollectionPower,data.result.stdMeExhgasCollectionPower);//主机（排烟）（主机T/C回收）
				self.setDomTextByValues("mePropulsionPower",data.result.mePropulsionPower,data.result.stdMePropulsionPower);//主机（传动系统）(推进做功)
				self.setDomTextByValues("geGe",data.result.geGe,data.result.stdGeGe);//副机（船舶电网）(机舱副机)
				self.setDomTextByValues("geDeckMachinery",data.result.geDeckMachinery,data.result.stdGeDeckMachinery);//副机（船舶电网）(甲板机械)
				self.setDomTextByValues("geAirconditionRefrigeration",data.result.geAirconditionRefrigeration,data.result.stdGeAirconditionRefrigeration);//副机（船舶电网）(空调冷藏)
				self.setDomTextByValues("geKitchenlaundry",data.result.geKitchenlaundry,data.result.stdGeKitchenlaundry);//副机（船舶电网）(厨房洗衣)
				self.setDomTextByValues("geElectricalequipment",data.result.geElectricalequipment,data.result.stdGeElectricalequipment);//副机（船舶电网）(电气设备)
				self.setDomTextByValues("boilerOiltankHeating",data.result.boilerOiltankHeating,data.result.stdBoilerOiltankHeating);//燃油锅炉（货油舱加热）
				self.setDomTextByValues("boilerEngineroomHeat",data.result.boilerEngineroomHeat,data.result.stdBoilerEngineroomHeat);//燃油锅炉（机舱加热）
				self.setDomTextByValues("boilerMachineryUsesteam",data.result.boilerMachineryUsesteam,data.result.stdBoilerMachineryUsesteam);//燃油锅炉（机械用蒸汽）
				self.setDomTextByValues("boilerOtheruse",data.result.boilerOtheruse,data.result.stdBoilerOtheruse);//燃油锅炉（其他用途）
				self.setDomTextByValues("otherequipmentWork",data.result.otherequipmentWork,data.result.stdOtherequipmentWork);//其他初级耗能(耗能做功)
				self.setDomTextByValues("usefulWorkEnergy",data.result.usefulWorkEnergy,data.result.stdUsefulWorkEnergy);//能源有效做功

			}else{
				self.setDomTextByValues("totalPowerInput",null,null);//总能源输入
				self.setDomTextByValues("efficiencyMe",null,null);//利用率（主机）
				self.setDomTextByValues("efficiencyGe",null,null);//利用率（副机）
				self.setDomTextByValues("efficiencyExh",null,null);//利用率（废气锅炉）
				self.setDomTextByValues("efficiencyAux",null,null);//利用率（燃油锅炉）
				self.setDomTextByValues("meOtherLoss",null,null);//其他损失   缺失
				self.setDomTextByValues("meExhgas",null,null);//主机（排烟）
				self.setDomTextByValues("meTransmission",null,null);//传动系统  缺失
				self.setDomTextByValues("meCoolingLoss",null,null);//主机（冷却损失）
				
				self.setDomTextByValues("geOtherLoss",null,null);//副机（其他损失）
				
				self.setDomTextByValues("geExhgas",null,null);//副机（排烟）
				self.setDomTextByValues("geShipPowerSystem",null,null);//副机（船舶电网）
				self.setDomTextByValues("geCoolingloss",null,null);//副机（冷却损失）
				self.setDomTextByValues("boilerSteamline",null,null);//燃油锅炉（蒸汽管路）
				self.setDomTextByValues("boilerHeatLoss",null,null);//燃油锅炉（锅炉热量损失）
				self.setDomTextByValues("otherequipmentEnergyLoss",null,null);//其他初级耗能(能量损失)
				self.setDomTextByValues("meExhgasLoss",null,null);//主机（排烟）(排烟损失)
				
				self.setDomTextByValues("mePropeller",null,null);//主机（传动系统）(螺旋桨)
				self.setDomTextByValues("meTransmissionLoss",null,null);//主机（传动系统）(传动损失)
				
				self.setDomTextByValues("geExhgasLoss",null,null);//副机（排烟）(排烟损失)
				self.setDomTextByValues("geElectricalLoad",null,null);//副机（船舶电网）(电力负载)
				self.setDomTextByValues("geElectrifiedWireNettingLoss",null,null);//副机（船舶电网）(电网损失)
				
				self.setDomTextByValues("boilerSteamLoad",null,null);//燃油锅炉（蒸汽负载）
				self.setDomTextByValues("boilerPipelineHeatLoss",null,null);//燃油锅炉（管路热量损失）
				
				self.setDomTextByValues("mePropulsionLoss",null,null);//主机（传动系统）(推进损失)
				self.setDomTextByValues("geElectricalLoadLoss",null,null);//副机（船舶电网）(负载损失)
				
				self.setDomTextByValues("boilerLoadLoss",null,null);//燃油锅炉（负载损失）
				
				self.setDomTextByValues("geExhgasCollectionPower",null,null);//副机（排烟）(副机T/C回收)
				self.setDomTextByValues("meExhgasCollectionPower",null,null);//主机（排烟）（主机T/C回收）
				self.setDomTextByValues("mePropulsionPower",null,null);//主机（传动系统）(推进做功)
				self.setDomTextByValues("geGe",null,null);//副机（船舶电网）(机舱副机)
				self.setDomTextByValues("geDeckMachinery",null,null);//副机（船舶电网）(甲板机械)
				self.setDomTextByValues("geAirconditionRefrigeration",null,null);//副机（船舶电网）(空调冷藏)
				self.setDomTextByValues("geKitchenlaundry",null,null);//副机（船舶电网）(厨房洗衣)
				self.setDomTextByValues("geElectricalequipment",null,null);//副机（船舶电网）(电气设备)
				self.setDomTextByValues("boilerOiltankHeating",null,null);//燃油锅炉（货油舱加热）
				self.setDomTextByValues("boilerEngineroomHeat",null,null);//燃油锅炉（机舱加热）
				self.setDomTextByValues("boilerMachineryUsesteam",null,null);//燃油锅炉（机械用蒸汽）
				self.setDomTextByValues("boilerOtheruse",null,null);//燃油锅炉（其他用途）
				self.setDomTextByValues("otherequipmentWork",null,null);//其他初级耗能(耗能做功)
				self.setDomTextByValues("usefulWorkEnergy",null,null);//能源有效做功
			}                       
		});
	},
	
	/**
	 * domid 	元素id
	 * value1 	原值
	 * value2	std值
	 */
	setDomTextByValues:function(domid,value1,value2){
		if(value1==undefined||value1==null||value1==""
			||value2==undefined||value2==null||value2==""){
			$("#"+domid).text("--");
			$("#std"+domid).text("");
		}else{
			$("#"+domid).text(value1);
			var stdValue=value2-value1;
			if(stdValue>0){
				$("#std"+domid).css("color","red").text(" +"+stdValue.toFixed(2));
			}else{
				$("#std"+domid).css("color","green").text(" "+stdValue.toFixed(2));
			}
		}
	}
}