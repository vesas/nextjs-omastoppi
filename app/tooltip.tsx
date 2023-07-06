

function Tooltip(props) {

    const { text } = props;

    return <div className="group relative">
  {props.children}
  <span className="text-sm hidden text-center py-1 px-2 absolute z-150 bg-gray-400 border border-gray-500 rounded text-gray-50 mt-26 group-hover:block">{text}</span>
  </div>
}

export default Tooltip;