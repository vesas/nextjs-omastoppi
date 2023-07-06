

function Tooltip(props) {

    const { text } = props;

    return <div className="group relative">
  {props.children}
  <span className="tooltip-text hidden text-center py-2 px-6 absolute z-150 bg-gray-500 border border-gray-600 rounded text-gray-50 mt-26 group-hover:block">{text}</span>
  </div>
}

export default Tooltip;