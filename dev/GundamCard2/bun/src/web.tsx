// bun add react react-dom @types/react @types/react-dom 
// compilerOptions.jsx = "react-jsx"
import * as ReactDom from "react-dom/client"
import { AppView } from "./client/component/AppView";

const rootDom = document.getElementById("root")
if (rootDom == null) {
    throw new Error(`div root not found`)
}
const root = ReactDom.createRoot(rootDom)
// function Component() { 
//     const [text, setText] = useState('abc');
//     return <div onClick={() => setText('def')}>{text}</div>
// }
root.render(<AppView />)