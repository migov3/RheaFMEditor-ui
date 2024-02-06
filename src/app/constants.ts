export const EXAMPLES_FILENAMES_URL = "/getExampleFMs";
export const EXAMPLE_UPLOAD_URL = "/uploadExampleFM";
export const UPLOAD_URL = "/uploadFM";
export const UPDATE_URL = "/updateFM";
export const DOWNLOAD_FM = "/downloadFM";
export const ALLOWED_LANGUAGES = "/allowed-languages";

// URL relativa a las imágenes
export const IMAGE_URL = "../../assets/img/";

// Extensiones de archivo
export const EXTENSION = '.gif';

// Relaciones que mapean a sus hijos (no son nodos en arbol)
// Para poder "saltarlas" hay que cambiar la lógica en los niveles
export const MANDATORY_RELATION: string = 'MANDATORY';
export const OPTIONAL_RELATION: string = 'OPTIONAL';

// Relaciones que representan un nodo
export const CARDINALITY_RELATION: string = 'CARDINALITY';
export const XOR_RELATION: string = 'XOR';
export const OR_RELATION: string = 'OR';
export const MUTEX_RELATION: string = 'MUTEX';
export const FEATURE_RELATION: string = 'MUTEX';
