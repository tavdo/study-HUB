import { Link } from "react-router-dom";


function Navigation() {
    return(
        <nav className="flex flex-col">
            <Link className="text-left  px-4 py-2 rounded-lg hover:bg-blue-700 hover:text-white" to="/Dashboard">Dashboard</Link>
            <Link className="text-left  px-4 py-2 rounded-lg hover:bg-blue-700 hover:text-white" to="/Notes">Notes</Link>
            <Link className="text-left  px-4 py-2 rounded-lg hover:bg-blue-700 hover:text-white" to="/Library">Library</Link>
            <Link className="text-left  px-4 py-2 rounded-lg hover:bg-blue-700 hover:text-white" to="/Group">Group</Link>
            <Link className="text-left  px-4 py-2 rounded-lg hover:bg-blue-700 hover:text-white" to="/AI" >AI</Link>
            <Link className="text-left  px-4 py-2 rounded-lg hover:bg-blue-700 hover:text-white" to="/Settings">Setting</Link>

           
        
           
       
        </nav>
    )
}


export default Navigation