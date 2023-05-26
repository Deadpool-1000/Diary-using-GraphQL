import Card from 'react-bootstrap/Card';
import moment from 'moment/moment';
import styles from './DiaryCard.module.css';
function DiaryCard(props) {
    const momentTimestamp = moment(props.tz);
    const timeString = momentTimestamp.format('LLL');  ;
    return (
        <Card className="w-75 px-3 py-3 mx-auto my-4">
            <Card.Body>
                <Card.Title>{props.title}</Card.Title>
                <Card.Text>{props.description}</Card.Text>
            </Card.Body>
            <hr/>
            <Card.Body className={styles['time-container']}>
                <p>Created at: <b>{timeString}</b></p>
            </Card.Body>
        </Card>
    )
}

export default DiaryCard;