import pkg from "react-bootstrap-table-ng"

// Vite dev prebundles this CJS library and hands back the whole namespace
// as the default export; Node/tests/build give the component directly.
const BootstrapTable = pkg && pkg.__esModule && pkg.default ? pkg.default : pkg

export default BootstrapTable
