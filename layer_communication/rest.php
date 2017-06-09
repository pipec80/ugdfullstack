<?php

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');
}

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    }
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    }
}
//
$method = $_SERVER['REQUEST_METHOD'];
$resource = $_SERVER['REQUEST_URI'];
//
function authenticate() {
	$dominio = 'Area restringida';
	// usuario => contraseña
	$usuarios = array('admin' => 'micontraseña', 'invitado' => 'invitado');
	if (empty($_SERVER['PHP_AUTH_DIGEST'])) {
		header('HTTP/1.1 401 Unauthorized');
		header('WWW-Authenticate: Digest realm="'.$dominio.'",qop="auth",nonce="'.uniqid().'",opaque="'.md5($dominio).'"');
		die('Texto a enviar si el usuario pulsa el botón Cancelar');
	}
	// Analizar la variable PHP_AUTH_DIGEST
	if (!($datos = analizar_http_digest($_SERVER['PHP_AUTH_DIGEST'])) || !isset($usuarios[$datos['username']])) die('Credenciales incorrectas');
	
	// Generar una respuesta válida
	$A1 = md5($datos['username'] . ':' . $dominio . ':' . $usuarios[$datos['username']]);
	$A2 = md5($_SERVER['REQUEST_METHOD'].':'.$datos['uri']);
	$respuesta_válida = md5($A1.':'.$datos['nonce'].':'.$datos['nc'].':'.$datos['cnonce'].':'.$datos['qop'].':'.$A2);
	
	if ($datos['response'] != $respuesta_válida) die('Credenciales incorrectas');
	
	// Todo bien, usuario y contraseña válidos
	echo 'Se ha identificado como: ' . $datos['username'];
}

// Función para analizar la cabecera de autenticación HTTP
function analizar_http_digest($txt)
{
    // Protección contra datos ausentes
    $partes_necesarias = array('nonce'=>1, 'nc'=>1, 'cnonce'=>1, 'qop'=>1, 'username'=>1, 'uri'=>1, 'response'=>1);
    $datos = array();
    $claves = implode('|', array_keys($partes_necesarias));

    preg_match_all('@(' . $claves . ')=(?:([\'"])([^\2]+?)\2|([^\s,]+))@', $txt, $coincidencias, PREG_SET_ORDER);

    foreach ($coincidencias as $c) {
        $datos[$c[1]] = $c[3] ? $c[3] : $c[4];
        unset($partes_necesarias[$c[1]]);
    }

    return $partes_necesarias ? false : $datos;
}

function cleanInputs($data){
	$clean_input = array();
	if(is_array($data)){
		foreach($data as $k => $v){
			$clean_input[$k] = cleanInputs($v);
		}
	}else{
		if(get_magic_quotes_gpc()){
			$data = trim(stripslashes($data));
		}
		$data = strip_tags($data);
		$clean_input = trim($data);
	}
	return $clean_input;
}

function logout(){
    header('HTTP/1.1 401 Unauthorized');
    return true;
}


switch ($method) {
	case 'GET'://request is read-only,
		//http_response_code(201);
		//[ <longitude> , <latitude> ]
		$latitude = $_GET['latitude'];
		$longitude = $_GET['longitude'];
		//$url  = 'http://datos.gob.cl/api/action/datastore_search?resource_id=ba0cd493-8bec-4806-91b5-4c2b5261f65e';
		
		//$url = 'http://127.0.0.1:9000/puntoventa?P=('.$latitude.','.$longitude.')&R=10';
		$url = 'http://127.0.0.1:9000/';
		$headers[] = 'Accept:application/json; charset=utf-8';
		$ch = curl_init(); 

		curl_setopt($ch, CURLOPT_FILETIME, true);
		curl_setopt($ch, CURLOPT_FRESH_CONNECT, false);
		curl_setopt($ch, CURLOPT_MAXREDIRS, 5);
		curl_setopt($ch, CURLOPT_HEADER, false);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_TIMEOUT, 5184000);
		curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 120);
		curl_setopt($ch, CURLOPT_NOSIGNAL, true);
		//Seguridad ataque 'man in the middle'
		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
	
	$ws_respuesta = curl_exec($ch);
	
	if ($ws_respuesta === false){
		echo $output = print_r(curl_getinfo($ch), true);
		
	}else{
		$rcode 	= (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
		$info 	= curl_getinfo($ch);
		echo  $ws_respuesta;
	}
	curl_close($ch);

	break;
	case 'POST'://requests are used to trigger operations on the server
		authenticate();
		$response = cleanInputs($_POST);
		header('Content-Type: application/json');
		echo json_encode($response);
		//echo $method;
		break;
	case 'DELETE'://delete the resource 
		/*parse_str(file_get_contents('php://input'), $arguments);
		$arguments[''];*/
		echo $method;
		break;
	case 'PUT'://create or update
		/*parse_str(file_get_contents('php://input'), $arguments);
		$arguments[''];*/
		echo $method;
		break;
	default:
		header('HTTP/1.1 405 Method Not Allowed');
		header('Allow: GET, PUT, DELETE, POST');
		$response = array('status' => '0', 'msg' => 'Request method not accepted');
		header('Content-Type: application/json');
		echo json_encode($response);
		break;
}
/*header('Content-Type: application/json');
echo json_encode($response);*/
