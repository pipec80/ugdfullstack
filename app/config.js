var config_module = angular.module('App.config.constant', [])
    .constant('APP_NAME', 'recarga Bip')
    .constant('APP_VERSION', '1.0')
    .constant('VERSION_TAG', /*VERSION_TAG_START*/ new Date().getTime() /*VERSION_TAG_END*/ )
    .constant('DEBUG_MODE', true)
    .constant('URL_API', 'http://localhost/ugdfullstack/layer_communication/rest.php');