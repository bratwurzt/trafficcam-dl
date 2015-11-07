var $0 = $p0.replace(new RegExp('^[\\s]+', ''), '');
if (!$0.startsWith('<') && !$0.startsWith('{') && !$0.startsWith('(') && !$0.startsWith('[') && !(Type.canCast(this.$3, RMap.CSVDeserializer))) {
 try {
  $0 = RMap._TEAE.$E($p0);
 } catch ($4) {
 }
}

 RMap._TEAE.$E = function ($p0) {
 var $0 = new StringBuilder();

 for (var $1 = 0; $1 < $p0.length; $1 += 2) {
  $0.append(String.fromCharCode(255 - $p0.charCodeAt($1)));
 }

 if ($p0.length > 0 && $p0.length % 2 === 1) {
  $p0 = $p0.substring(0, $p0.length - 1);
 }

 for (var $2 = $p0.length - 1; $2 >= 0; $2 -= 2) {
  $0.append(String.fromCharCode(255 - $p0.charCodeAt($2)));
 }

 return $0.toString();
}