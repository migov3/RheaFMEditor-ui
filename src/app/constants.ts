export const EXAMPLES_FILENAMES_URL = "/getExampleFMs";
export const EXAMPLE_UPLOAD_URL = "/uploadExampleFM";
export const UPLOAD_URL = "/uploadFM";
export const UPDATE_URL = "/updateFM";
export const DOWNLOAD_FM = "/downloadFM";
export const ALLOWED_LANGUAGES = "/allowed-languages";
export const REFACTORING = "/refactor"
export const CACHEDFM = "/getCachedFM"

// URL relativa a las imágenes
export const IMAGE_URL = "../../assets/img/";

// Extensiones de archivo
export const EXTENSION = '.gif';

// Relaciones
export const MANDATORY_RELATION: string = 'MANDATORY';
export const OPTIONAL_RELATION: string = 'OPTIONAL';

// Relaciones que representan un nodo
export const CARDINALITY_RELATION: string = 'CARDINALITY';
export const XOR_RELATION: string = 'XOR';
export const OR_RELATION: string = 'OR';
export const MUTEX_RELATION: string = 'MUTEX';
export const FEATURE_RELATION: string = 'FEATURE';

export const NODE_RELATION_TYPES: string[] = [CARDINALITY_RELATION, XOR_RELATION, OR_RELATION, MUTEX_RELATION, FEATURE_RELATION];

export const NOT_FUNCTION: string = "NOT";
export const IMPLIES_FUNCTION: string = "IMPLIES";
export const EXCLUDES_FUNCTION: string = "EXCLUDES";
export const AND_FUNCTION: string = "AND";
export const OR_FUNCTION: string = "OR";
export const XOR_FUNCTION: string = "XOR";  
export const FORMULA_FUNCS: string[] = [NOT_FUNCTION, IMPLIES_FUNCTION, AND_FUNCTION, OR_FUNCTION, XOR_FUNCTION, EXCLUDES_FUNCTION];