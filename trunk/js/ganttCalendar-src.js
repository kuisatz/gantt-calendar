/*
 * Gantt Calendar by Julien CORON - 2012
 *  
 */
TimeLineMonth = function(container, month, year, ressources, updateMonthCallback) {
	return this.init(container, month, year, ressources, updateMonthCallback);
};

$.extend(TimeLineMonth.prototype, {
	// object variables
	container:'',
	month: '',
	year: '',
	days: {1:[31,31],2:[28,29],3:[31,31],4:[30,30],5:[31,31],6:[30,30],
		7:[31,31],8:[31,31],9:[30,30],10:[31,31],11:[30,30],12:[31,31]
	},
	lang: 'fr',
	months: {'fr':["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"],
		'en':["January", "February", "March", "April", "May", "June", "July", "Agust", "September", "October", "November", "December"]
	},
	ressourcesColumnHeader : 'Ressources',
	init: function(container, month, year, ressources, updateMonthCallback) {
		this.container = container;
		this.month = month;
		this.year = year;
		this.ressources = ressources;
		this.updateMonthCallback = updateMonthCallback || function(){};

		this.drawElements();
		this.updateMonthCallback();
		
		return this;
	},

	drawElements: function() {
		var containerObj = $("#"+this.container);
		containerObj.timeLineMonth = this;
		
		var largeCalendar = $( document.createElement('div') ).addClass("largeCalendar");
		containerObj.html(largeCalendar);
		/*
		var debugObj = $( document.createElement('div') ).addClass("debug");
		containerObj.after(debugObj);
		//debugObj.html("Debug");
		*/
		var monthLine = $( document.createElement('div') ).addClass("month");
		largeCalendar.html(monthLine);
		monthLine.html("<div class=\"prevMonth\"></div>\
		<div class=\"nameMonth\">"+this.months[this.lang][this.month-1]+" "+this.year+"</div>\
		<div class=\"nextMonth\" id=\"nextMonth\"></div>");
		
		var calendarHeaders = $( document.createElement('div') ).addClass("leftColumn horizontalCalendarHeaders");
		largeCalendar.append(calendarHeaders);
		
		var eventsContainer = $( document.createElement('div') ).addClass("eventsContainer");
		largeCalendar.append(eventsContainer);
		
		var headerRessources = $( document.createElement('div') ).addClass("headerRessources");
		calendarHeaders.html(headerRessources);

		// update the size of eventsContainer to match with borders
		eventsContainer.width(largeCalendar.width() - headerRessources.width() - 1);

		var spanLabelCenter = $( document.createElement('span') ).addClass("labelCenter").html(this.ressourcesColumnHeader);
		headerRessources.html(spanLabelCenter);
		
		var listRessources = $( document.createElement('div') ).addClass("listRessources");
		calendarHeaders.append(listRessources);
		
		
		// All groups and ressources, prepare left side
		for(var indexGroup=0;indexGroup<this.ressources.groups.length;indexGroup++){
			var group = this.ressources.groups[indexGroup];
			listRessources.append("<div id=\"group_"+group.id+"\" class=\"group\">\
					<span class=\"labelLeft\">"+group.name+"</span>\
				</div>");
			
			for(var indexRessource=0;indexRessource<group.ressources.length;indexRessource++){
				var ressource = group.ressources[indexRessource];
				listRessources.append("<div id=\"ressource_"+ressource.id+"\" data-group=\"group_"+group.id+"\" class=\"ressource lineRessource\">\
					<span class=\"labelRight\">"+ressource.name+"</span>\
					</div>");
			}
		}
		
		var bisextile = ( (this.year%4==0 && this.year%100!=0) || this.year%400==0 )?(1):(0);
		var horizontalCalendarContent = $( document.createElement('div') )
			.addClass("horizontalCalendarContent for"+this.days[this.month][bisextile]+"days");
		eventsContainer.append(horizontalCalendarContent);
		
		var lineOfDays = $( document.createElement('div') ).addClass("lineOfDays");
		horizontalCalendarContent.html(lineOfDays);
		
		var htmlDays = "";
		for(var indexDay=1;indexDay<=this.days[this.month][bisextile];indexDay++){
			var day2digits = indexDay;
			htmlDays += "<div class=\"day\" id=\"day_"+day2digits+"\">"+day2digits+"</div>";
		}
		lineOfDays.html(htmlDays);
		
		// All groups and ressources, prepare content
		for(var indexGroup=0;indexGroup<this.ressources.groups.length;indexGroup++){
			var group = this.ressources.groups[indexGroup];
			horizontalCalendarContent.append("<div data-group=\"group_"+group.id+"\" class=\"group\">&nbsp;</div>");
			
			for(var indexRessource=0;indexRessource<group.ressources.length;indexRessource++){
				var ressource = group.ressources[indexRessource];
				horizontalCalendarContent.append("<div class=\"lineForRessource\" data-ressource=\"ressource_"+ressource.id+"\" id=\"events_r_"+ressource.id+"\"></div>");
			}
		}
		
		this.defineEvents(this);
	},
	
	goToNextMonth: function(){
		if(this.month == 12){
			this.month = 1;
			this.year++;
		} else{
			this.month++;
		}
		this.drawElements();
		this.updateMonthCallback();
	},
	
	goToPrevMonth: function(){
		if(this.month == 1){
			this.month = 12;
			this.year--;
		} else{
			this.month--;
		}
		this.drawElements();
		this.updateMonthCallback();
	},
	
	updateWidth: function() {
		$(".eventsContainer").width($(".largeCalendar").width() - $(".headerRessources").width() - 1);
	},
	
	defineEvents: function($calendarObject){
		
		$(".prevMonth").click(function () {
			$calendarObject.goToPrevMonth();
		});

		$(".nextMonth").click(function () {
			$calendarObject.goToNextMonth();
		});
		
		$(".horizontalCalendarContent").keydown(function(event) {	   
			switch(event.keyCode) {
				case 34: // PAGE_DOWN
					$calendarObject.goToPrevMonth();
					break;
				case 33: //PAGE_UP
					$calendarObject.goToNextMonth();
					alert("up");
					break;
				default:
					break;
			};
			alert("key");
		});
	}
	
});

Event = function(ressourceId, eventId, startDay, endDay, label) {
	  this.init(ressourceId, eventId, startDay, endDay, label);
};

$.extend(Event.prototype, {
	// object variables
	ressourceId: '',
	eventId: '',
	startDay: '',
	endDay: '',
	label: '',
	
	init: function(ressourceId, eventId, startDay, endDay, label) {
		this.ressourceId = ressourceId;
		this.eventId = eventId;
		this.startDay = startDay;
		this.endDay = endDay;
		this.label = label;
	},

	drawIn: function(containerId) {
		var margin = 50 * (this.startDay - 1);
		var width = 50 * (this.endDay - this.startDay) - 3;
		
		$("#"+containerId).find("#events_r_"+this.ressourceId).append('<div id="'+this.eventId+'" class="event" style="left: '+margin+'px;width:'+width+'px;">'+this.label+'</div>');
		$("#"+containerId).find("#"+this.eventId).draggable({ axis: "x", containment: "parent", opacity: 0.5, snap: true });
		$("#"+containerId).find("#events_r_"+this.ressourceId).droppable({
			drop: function(event, ui){
				var containerLeft = $(this).offset().left;
				var eventLeft = ui.offset.left;
				var newDayStart = 1 + ((eventLeft - containerLeft) / 50); // px
				$(".debug").html("newDayStart: "+  newDayStart );
			}
		});
		return this; 
	}
});
