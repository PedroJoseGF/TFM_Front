import './Card.css';

const Card = ({ title, className, children}) => {

    return (
      <div className={className}>
        <h2>{title}</h2>
        <ul className={className + '-content'}>{children}</ul>
      </div>
    );
};

export default Card;