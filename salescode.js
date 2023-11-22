
var MAP_BASE = '';
var mapId = '/salescode';
var navId = mmw._custom.navId;

var headerEl = mmw._overlay.headerEl;
var middleheaderEl = mmw._overlay.middleheaderEl;
var rightheaderEl = mmw._overlay.rightheaderEl;
var rightbarEl = mmw._overlay.rightbarEl;

var map = mmw.map;
var marker = mmw.marker;
var markerpopup = mmw.markerpopup;

document.title = 'SalesCode AI';
document.getElementsByTagName('link')[0].href = MAP_BASE + mapId + '/img/logo-xxxxs.png';

map.setZoom(2.5);

rightheaderEl.style.display = 'flex';
rightheaderEl.style['padding-left'] = '30px';
rightheaderEl.style.width = '220px';

rightheaderEl.firstElementChild.src = MAP_BASE + mapId + '/img/logo.png';
rightheaderEl.firstElementChild.style.height = '75px';

rightbarEl.style.width = '250px';


if(!navId) {
	
	map.flyTo({center: [80,22] });

	rightbarEl.style.display = 'grid';

	var noOfList = 2;
	var titleHeight = (35 * noOfList);
	
	let rightbarListTitleEl = document.createElement('div');
	rightbarListTitleEl.append('Offices/Partners');
	rightbarEl.append(rightbarListTitleEl);

	let rightbarListEl = document.createElement('ol');
	rightbarListEl.classList.add('rightbarlist');
	rightbarEl.append(rightbarListEl);

	rightbarEl.append(document.createElement('hr'));

	let rightbarList2TitleEl = document.createElement('div');
	rightbarList2TitleEl.append('Clients');
	rightbarEl.append(rightbarList2TitleEl);

	var rightbarList2El = document.createElement('ol');
	rightbarList2El.classList.add('rightbarlist');
	rightbarEl.append(rightbarList2El);

	rightbarEl.append(document.createElement('hr'));
	
	let rightbarList3TitleEl = document.createElement('div');
	rightbarList3TitleEl.append('Users');
	rightbarEl.append(rightbarList3TitleEl);
	
	var rightbarList3El = document.createElement('div');
	rightbarList3El.classList.add('nolist');
	rightbarEl.append(rightbarList3El);

	rightbarListHeight = (rightbarEl.clientHeight -  titleHeight ) / noOfList;

	mmw._overlay.makeCollapsible(rightbarListTitleEl);
	mmw._overlay.makeCollapsible(rightbarList2TitleEl);
	mmw._overlay.makeCollapsible(rightbarList3TitleEl);
	
	if(map.getCanvasContainer().offsetWidth < 640) {
		headerEl.style.width = '50px';
		headerEl.children[1].style.display = 'none';
		mmw._overlay.collapse(rightbarList2TitleEl);
	}
	
	mmw._overlay.collapse(rightbarList3TitleEl);
	
	map.loadImage( MAP_BASE + mapId + '/img/logo-xs.png', async (error, image) => {
			if (error) throw error;
			map.addImage('logo-xs', image);
		}
	);
	
	map.loadImage( MAP_BASE + mapId + '/img/logo-xxxs.png', async (error, image) => {
			if (error) throw error;
			map.addImage('logo-xxxs', image);
		}
	);
	
	let geoJSONData = [];
	
	map.on('load',  async () => {
	
		geoJSONData[0] = await mmw._common.fetchJSON(MAP_BASE + mapId + '/data/headoffice.json');
		map.addSource('headoffice', { 'type': 'geojson', 'data': geoJSONData[0],
			"attribution" : 'Source <a href="https://salescode.ai/">SalesCode.ai</a>'
		});
		var symbolLayer = newSymbolLayer('headoffice', 'logo-xs', ['get', 'name']);
		symbolLayer.layout['text-offset'] = [1,2];
		map.addLayer(symbolLayer);
		
		geoJSONData[1] = await mmw._common.fetchJSON(MAP_BASE + mapId + '/data/office.json');
		map.addSource('office', { 'type': 'geojson','data': geoJSONData[1] });
		var symbolLayer = newSymbolLayer('office', 'logo-xs', ['get', 'name']);
		symbolLayer.layout['text-offset'] = [1,2];
		map.addLayer(symbolLayer);
				
		geoJSONData[2] = await mmw._common.fetchJSON(MAP_BASE + mapId + '/data/client.json');
		map.addSource('client', { 'type': 'geojson','data': geoJSONData[2] });
		var symbolLayer = newSymbolLayer('client', 'logo-xxxs', ['get', 'name']);
		symbolLayer.layout['text-offset'] = [1,1];
		map.addLayer(symbolLayer);
		
		populateUI(geoJSONData);
		
		var data = await fetch(MAP_BASE + mapId + '/data/stats.json');
		jsonData = await data.json();
		generateChart(rightbarList3El, jsonData['users']);
		
	});
	
	function populateUI(geoJSONData) {
	
		var memberEl = document.createElement('li');
		memberEl.innerHTML = '<img class="logo" src="' + MAP_BASE + mapId + '/img/office/Gurgaon.png"></img>Gurgaon ( HO )';
		memberEl.setAttribute('onclick','map.flyTo({ zoom: 4.5, center: [77.0293992269219, 28.46713588067425] });');
		rightbarListEl.prepend(memberEl);
		
		geoJSONData[1].features.forEach( (f) => {
			var memberEl = document.createElement('li');
			memberEl.innerHTML = '<img class="logo" src="'+ MAP_BASE + mapId + '/img/office/'+f.properties.name+'.png"</img>' + f.properties.name;
			memberEl.setAttribute('onclick','map.flyTo({ zoom: 4.5, center: ['+ f.geometry.coordinates +'] })');
			rightbarListEl.append(memberEl);
		});

		geoJSONData[2].features.forEach( (f) => {
			var memberEl = document.createElement('li');
			memberEl.innerHTML = '<img class="logo" src="./img/flag/'+f.properties.name+'.png"</img>' + f.properties.name;
			memberEl.setAttribute('onclick','map.flyTo({ zoom: 3.5, center: ['+ f.geometry.coordinates +'] })');
			rightbarList2El.appendChild(memberEl);
		});
	
	}	
}

function generateChart(elem, data) {
const chart = c3.generate({

		bindto: elem,
		size : { height : '140', width: '200' },
		
		data: {
			x : 'x',
			xFormat: '%d-%m-%Y',
			columns: [ ['x', ...data.xAxis ], ['y', ...data.yAxis ]],
			names: { y: [ 'Users' ] },
			type: 'line'
		},
		
		axis: {
			y: {
				show: false
			},
			x: {
				type: 'timeseries',
				tick: { format: '%y' }
			}
		}
	});
}


