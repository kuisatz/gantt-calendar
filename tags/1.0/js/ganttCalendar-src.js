/*
 * Gantt Calendar by Julien CORON - 2012
 * Copyright 2012 Julien CORON
 * 
 * Licence :
   Ce programme est un logiciel libre ; vous pouvez le redistribuer ou le 
   modifier suivant les termes de la GNU General Public License telle que 
   publiée par la Free Software Foundation ; soit la version 3 de la licence, 
   soit (à votre gré) toute version ultérieure.

   Ce programme est distribué dans l'espoir qu'il sera utile, mais SANS AUCUNE 
   GARANTIE ; pas même la garantie implicite de COMMERCIABILISABILITÉ ni 
   d'ADÉQUATION à UN OBJECTIF PARTICULIER. Consultez la GNU General Public 
   License pour plus de détails.
 * 
 * 
   This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
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

		//this.drawElements();
		//this.updateMonthCallback();
		
		return this;
	},

	drawElements: function() {
		var containerObj, largeCalendar, monthLine, calendarHeaders, eventsContainer, headerRessources, 
			spanLabelCenter, listRessources, indexGroup, group, indexRessource,
			ressource, bisextile, horizontalCalendarContent, lineOfDays, htmlDays, 
			indexDay, day2digits;
		containerObj = $("#"+this.container);
		containerObj.timeLineMonth = this;
		
		largeCalendar = $( document.createElement('div') ).addClass("largeCalendar");
		containerObj.html(largeCalendar);
		
		monthLine = $( document.createElement('div') ).addClass("month");
		largeCalendar.html(monthLine);
		monthLine.html("<div class=\"prevMonth\" title=\"[Page down] Go to Previous month\"></div>\
		<div class=\"nameMonth\">"+this.months[this.lang][this.month-1]+" "+this.year+"</div>\
		<div class=\"nextMonth\" id=\"nextMonth\" title=\"[Page up] Go to next month\"></div>");
		
		calendarHeaders = $( document.createElement('div') ).addClass("leftColumn horizontalCalendarHeaders");
		largeCalendar.append(calendarHeaders);
		
		eventsContainer = $( document.createElement('div') ).addClass("eventsContainer");
		largeCalendar.append(eventsContainer);
		
		headerRessources = $( document.createElement('div') ).addClass("headerRessources");
		calendarHeaders.html(headerRessources);

		// update the size of eventsContainer to match with borders
		eventsContainer.width(largeCalendar.width() - headerRessources.width() - 1);

		spanLabelCenter = $( document.createElement('span') ).addClass("labelCenter").html(this.ressourcesColumnHeader);
		headerRessources.html(spanLabelCenter);
		
		listRessources = $( document.createElement('div') ).addClass("listRessources");
		calendarHeaders.append(listRessources);
		
		
		// All groups and ressources, prepare left side
		for(indexGroup=0;indexGroup<this.ressources.groups.length;indexGroup++){
			group = this.ressources.groups[indexGroup];
			listRessources.append("<div id=\"group_"+group.id+"\" class=\"group\">\
					<span class=\"labelLeft\">"+group.name+"</span>\
				</div>");
			
			for(indexRessource=0;indexRessource<group.ressources.length;indexRessource++){
				ressource = group.ressources[indexRessource];
				listRessources.append("<div id=\"ressource_"+ressource.id+"\" data-group=\"group_"+group.id+"\" class=\"ressource lineRessource\">\
					<span class=\"labelRight\">"+ressource.name+"</span>\
					</div>");
			}
		}
		
		bisextile = ( (this.year%4==0 && this.year%100!=0) || this.year%400==0 )?(1):(0);
		horizontalCalendarContent = $( document.createElement('div') )
			.addClass("horizontalCalendarContent for"+this.days[this.month][bisextile]+"days")
			.attr("tabindex", "0");
		eventsContainer.append(horizontalCalendarContent);
		
		lineOfDays = $( document.createElement('div') ).addClass("lineOfDays");
		horizontalCalendarContent.html(lineOfDays);
		
		htmlDays = "";
		for(indexDay=1;indexDay<=this.days[this.month][bisextile];indexDay++){
			day2digits = (indexDay<10)?("0"+indexDay):(indexDay);
			htmlDays += "<div class=\"day\" id=\"day_"+day2digits+"\">"+day2digits+"</div>";
		}
		lineOfDays.html(htmlDays);
		
		// All groups and ressources, prepare content
		for(indexGroup=0;indexGroup<this.ressources.groups.length;indexGroup++){
			group = this.ressources.groups[indexGroup];
			horizontalCalendarContent.append("<div data-group=\"group_"+group.id+"\" class=\"group\">&nbsp;</div>");
			
			for(indexRessource=0;indexRessource<group.ressources.length;indexRessource++){
				ressource = group.ressources[indexRessource];
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
					$(".horizontalCalendarContent").focus();
					break;
				case 33: //PAGE_UP
					$calendarObject.goToNextMonth();
					$(".horizontalCalendarContent").focus();
					break;
				default:
					break;
			};
		});
		
		$(window).resize(function() {
			$calendarObject.drawElements();
			$calendarObject.updateMonthCallback();
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
	jObject: null,
	
	init: function(ressourceId, eventId, startDay, endDay, label) {
		this.ressourceId = ressourceId;
		this.eventId = eventId;
		this.startDay = startDay;
		this.endDay = endDay;
		this.label = label;
	},

	drawIn: function(containerId) {
		var margin, width;
		margin = 50 * (this.startDay - 1);
		width = 50 * (this.endDay - this.startDay) - 3;
		
		$("#"+containerId).find("#events_r_"+this.ressourceId).append('<div id="'+this.eventId+'" class="event" style="left: '+margin+'px;width:'+width+'px;">'+this.label+'</div>');
		this.jObject = $("#"+this.eventId);
		$("#"+containerId).find("#"+this.eventId).draggable({ axis: "x", containment: "parent", opacity: 0.5, snap: true });
		$("#"+containerId).find("#events_r_"+this.ressourceId).droppable({
			drop: function(event, ui){
				var containerLeft, eventLeft, newDayStart;
				containerLeft = $(this).offset().left;
				eventLeft = ui.offset.left;
				newDayStart = 1 + ((eventLeft - containerLeft) / 50); // px
				$(".debug").html("newDayStart: "+  newDayStart );
			}
		});
		return this; 
	}
});
