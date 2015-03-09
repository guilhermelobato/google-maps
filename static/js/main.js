/* ==========================================================================
   Como Chegar no Google Maps
  ========================================================================== */

var directionDisplay;
var directionsService;
var marcadorCentral;
var map;


$(document).ready(function(){

	if ($("#comoChegar").length > 0){
		directionsDisplay = new google.maps.DirectionsRenderer();
		
		// Informar as coordenadas Latitude e Longitude do local desejado
		var myLatlng = new google.maps.LatLng(-7.149356, -34.797979);
		var myOptions = {
			zoom:16,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			center: myLatlng,
			scrollwheel: false,
		}

		map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
		
		marcadorCentral = new google.maps.Marker({
			// Ao abrir a página mantem o endereço marcado
			position : new google.maps.LatLng(-7.149356, -34.797979),
			visible : true,
			map : map
		})
		
		directionsDisplay.setMap(map);
		directionsDisplay.setPanel(document.getElementById("directionsPanel"));
	}

});

/* 
Função de geolocalização
  ========================================================================== */


      var map;

      function initialize() {

        // //define as opções iniciais do mapa
        // var mapOptions = {
        //   zoom: 14
        // };
        
        //instacia um novo mapa
        //map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

        // verifica se tem suporte a geolocalização
        if(navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {

            // pegando a latitude e longitude e definindo um elemento LatLng do maps
            var pos = new google.maps.LatLng(position.coords.latitude,
                                             position.coords.longitude);
            console.log(pos);

            // criando um marcador para o nosso map
            var infowindow = new google.maps.InfoWindow({
              map: map,
              position: pos,
              content: '<p>Voce está aqui.</p>'
              
            });
           

            //pede para o mapa centralizar
            map.setCenter(pos);
          }, function() {
            //o Browser falhou no acesso a geolocalização
            handleNoGeolocation(true);
          });
        } else {
          // Browser não tem suporte a geolocalização
          handleNoGeolocation(false);
        }
      }


      function handleNoGeolocation(errorFlag) {
        if (errorFlag) {
          var content = 'Error: The Geolocation service failed.';
        } else {
          var content = 'Error: Your browser doesn\'t support geolocation.';
        }
        // caso falhe ele dá uma posição aleatória
        var options = {

          map: map,
          position: new google.maps.LatLng(60, 105),
          content: content
        };

        var infowindow = new google.maps.InfoWindow(options);
        map.setCenter(options.position);
      }

      google.maps.event.addDomListener(window, 'load', initialize);







/* 
Função que calcula a rota
  ========================================================================== */
function calcRoute() {
	// Carrega o endereço inserido no campo com ID endereço
	var start = document.getElementById("endereco").value;
	// Captura o campo value do input no qual será inserido o endereço de destino predefinido.
	var end = document.getElementById("destino").value;
	var request = {
		origin:start, 
		destination:end,
		travelMode: google.maps.DirectionsTravelMode.DRIVING
	};


	directionsService =	new google.maps.DirectionsService();
	directionsService.route(request, function(response, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			directionsDisplay.setDirections(response);
			// Abre as coordenadas abaixo do mapa
			$jq('#comoChegar #mapview .direcao').slideDown(1000);
			marcadorCentral.setVisible(false);
		} else {
			if(status == "NOT_FOUND"){
				alert('Endereço não encontrado');				
			} else {
				alert(status);
			}
		}

		document.getElementById('mapview').style.visibility = 'visible';
	});
}




/* ==========================================================================
   Marcador customizado no Google Maps
   ========================================================================== */



  // Quando a janela terminar de carregar o google maps será carregado
	google.maps.event.addDomListener(window, 'load', init);

	function init() {
		// Opções básicas para um simples Google Maps
		// Para mais opções acesse: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
		var mapOptions = {
			// Zoom você quer o mapa para começar a exibir o mapa (sempre obrigatório)
			zoom: 15,

			// A latitude e longitude para centrar o mapa (sempre obrigatório)
			center: new google.maps.LatLng(-7.149356, -34.797979), // Estação Ciencia, João pessoa
			mapTypeControlOptions: {
		        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
		        position: google.maps.ControlPosition.BOTTOM_CENTER
		    },
		    panControl: true,
		    panControlOptions: {
		        position: google.maps.ControlPosition.TOP_RIGHT
		    },
		    zoomControl: true,
		    zoomControlOptions: {
		        style: google.maps.ZoomControlStyle.SMALL,
		        position: google.maps.ControlPosition.TOP_RIGHT
		    },

			// Como você gostaria que o estilo do mapa.
			// Este é o lugar onde você iria colar qualquer estilo encontrado no Snazzy Maps.
			styles: [{"featureType":"landscape","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"stylers":[{"hue":"#00aaff"},{"saturation":-100},{"gamma":2.15},{"lightness":12}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"visibility":"on"},{"lightness":24}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":57}]}]
		};

		// Obter o elemento HTML DOM que conterá o seu mapa
		// Estamos usando um div com id = "mapa" visto abaixo no <body>
		var mapElement = document.getElementById('map');

		// Cria o mapa do Google , usando o nosso elemento e opções acima definido
		var map = new google.maps.Map(mapElement, mapOptions);

		// Vamos também adicionar um marcador , enquanto estamos no assunto
		// var marker = new google.maps.Marker({
		//     position: new google.maps.LatLng(-7.149356, -34.797979),
		//     map: map,
		//     title: 'Titulo da localização'
		// });
		
		// Caminho de origem para carregar a imagem do marcador
		var image = 'static/img/marcador/marcador.png';
		var myLatLng = new google.maps.LatLng(-7.149356, -34.797979);
		var beachMarker = new google.maps.Marker({
			position: myLatLng,
			map: map,
			icon: image
		});


	}


