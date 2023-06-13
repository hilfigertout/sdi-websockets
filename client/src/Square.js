const Square = ({ id, handleClick }) => {


  return ( 
  <div onClick={handleClick} className="square" id={id}>
    X
  </div> 
  );
}
 
export default Square;