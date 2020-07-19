var parciales = [];
var finales = [];
var preguntaSeleccionada;

$('#jugar').on('click',function(){
	$('#formPregunta').empty();
	$('#resultadoPregunta').empty();
	var preguntasGuardadas = JSON.parse(localStorage.getItem('preguntas'));
	var resultadoPregunta  = $('#resultadoPregunta').removeClass('fondoBien').removeClass('fondoMal');
	var nroPregunta = Math.floor(Math.random() * preguntasGuardadas.length -1) + 1;
	preguntaSeleccionada = preguntasGuardadas[nroPregunta];
	var formPregunta = $('#formPregunta');
	var fieldset = $('<fieldset id="preg" data-role="controlgroup">');
	var legend = $('<legend>');
	legend.html(preguntaSeleccionada.pregunta);
	fieldset.append(legend);
	for(var i in preguntaSeleccionada.respuestas){
		var texto = preguntaSeleccionada.respuestas[i].texto;
		var opcion = preguntaSeleccionada.respuestas[i].opcion;
		var input = $('<input type="radio"' + ' name="respuesta"' + ' id=' + i  + ' value=' + preguntaSeleccionada.respuestas[i].opcion + '>');
		var label = $('<label for=' + i +' >');
		label.html(preguntaSeleccionada.respuestas[i].texto)
		fieldset.append(input);
		fieldset.append(label);
	}
	formPregunta.append($(fieldset));
	formPregunta.append('<input style="padding-top:2em" data-theme="a" id="validarPreg" type="submit" data-role="button" value="Aceptar" />');
	$(formPregunta).trigger('create');
});
		
$('#formPregunta').on('submit',function(){
	if(preguntaSeleccionada){
		var respuestaElegida = $('#preg :radio:checked').val();
		if(preguntaSeleccionada.respuesta == respuestaElegida){
			var resultadoPregunta = $('#resultadoPregunta');
			resultadoPregunta.addClass('fondoBien');
			$(resultadoPregunta).append('<p class="parrafoResultado">Bien! , la tienes clara con HTML y CSS</p>');
		}else{
			var resultadoPregunta = $('#resultadoPregunta');
			resultadoPregunta.addClass('fondoMal');
			$(resultadoPregunta).append('<p class="parrafoResultado">Mal!, no mandes fruta!!</p>');
		}
		$('#formPregunta').empty();
	}
	return false;
});

$('#formAgregar').on('submit',function(){
	var obj = crearObj();
	var mainParciales = $('#mainParciales');
	var mainFinales = $('#mainFinales');
	if(obj.tipo =='Parcial'){
		mainParciales.append(crearArticle(obj));
		guardarDatos('parciales',mainParciales);
	}else{
		mainFinales.append(crearArticle(obj));
		guardarDatos('finales',mainFinales);
	}
	$.mobile.navigate('#proximasFechas');
	return false;
});

$(document).on('ready',function(){
	setPreguntas();
	var parciales = localStorage.getItem('parciales');
	var finales = localStorage.getItem('finales');
	if(parciales!=undefined && parciales!=null && parciales!=''){
		var mainParciales = $('#mainParciales');
		parciales = JSON.parse(parciales);
		$.each(parciales, function(i,parcial){
			var article = $('<article class="contenedorArticle"></article>');
			article.html(parcial)
			mainParciales.append(article);
		});
	}
	if(finales!=undefined && finales!=null && finales!=''){
		var mainFinales = $('#mainFinales');
		finales = JSON.parse(finales);
		$.each(finales, function(i,final){
			var article = $('<article class="contenedorArticle"></article>');
			article.html(final)
			mainFinales.append(article);
		});
	}
	$('#jugar').click();
});

$(document).on('pagebeforeshow', function(){
	resetarForm();
});

$('#mainParciales').on('taphold','article', function(){
	var article = $(this);
	var span = article.children()[0];
	$(span).replaceWith('<a class="borrarItem" href="#proximasFechas" data-role="button">X</a>');
	$('.borrarItem').on('click',function(){
		var respuesta = confirm('¿Está seguro de eliminar el parcial?');
		if(respuesta){
			$(article).remove();
			eliminar('parciales');
		}else{
			$('.borrarItem').replaceWith($(span));
		}
	});
});

$('#mainFinales').on('taphold','article', function(){
	var article = $(this);
	var span = article.children()[0];
	$(span).replaceWith('<a class="borrarItem" href="#proximasFechas" data-role="button">X</a>');
	$('.borrarItem').on('click',function(){
		var respuesta = confirm('¿Está seguro de eliminar el final?');
		if(respuesta){
			$(article).remove();
			eliminar('finales');
		}else{
			$('.borrarItem').replaceWith($(span));
		}
	});
});

$('#borrar').on('click',function(){
	var nombreTab = $("#tabs .ui-tabs-active").text().toLowerCase();
	var respuesta = confirm('¿Está seguro de eliminar todos los ' + nombreTab);
	if(respuesta){
	   if(nombreTab == 'parciales'){
	   	$('#mainParciales').empty();
	   }else{
	   	$('#mainFinales').empty();
	   }
	  localStorage.removeItem(nombreTab);
	}
});

function eliminar(tipo){
	var array = [];
	if(tipo=='finales'){
		$('#mainFinales article').each(function(){
			array.push($(this).html());
		});
	}else{
		$('#mainParciales article').each(function(){
			array.push($(this).html());
		});
	}
	localStorage.setItem(tipo,JSON.stringify(array));
}

function crearObj(){
	return{
		materia: $('#materia').val(),
		fecha: $('#fecha').val(),
		descripcion: $('#descripcion').val(),
		tipo: $('#tipo :radio:checked').val(),
	};
}

function crearArticle(obj){
	var article = $('<article class="contenedorArticle"></article>');
	var span = $('<span>' + parsearFecha(obj.fecha) + '</span>');
	var div = $('<div></div>');
	var h1 = $('<h1>' + obj.materia + '</h1>');
	var p = $('<p>' + obj.descripcion + '</p>');
	div.append(h1).append(p);
	article.append(span).append(div);
	return article;
}

function parsearFecha(fecha){
	var nuevaFecha = fecha.split('-');
	return nuevaFecha[2] + '/' + nuevaFecha[1] + '/' + nuevaFecha[0];
}

function guardarDatos(tipo,html){
	parciales.length = 0;
	finales.length = 0;
	if(tipo == 'parciales'){
		$('#mainParciales article').each(function(){
			parciales.push($(this).html());
		});
		localStorage.setItem(tipo,JSON.stringify(parciales));
	}else{
		$('#mainFinales article').each(function(){
			finales.push($(this).html());
		});
		localStorage.setItem(tipo,JSON.stringify(finales));
	}
}

function setPreguntas(){
	var data = localStorage.getItem('preguntas');
	if(data==null || data==undefined || data==''){
		localStorage.setItem('preguntas',JSON.stringify(preguntas));
	}
}

function resetarForm(){
	$('form').each(function(){ 
		this.reset(); 
	});
}