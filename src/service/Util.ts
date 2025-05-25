import moment from 'moment';

const formatDate = (dateString: string) => {
    const date = moment(dateString);
    if (!date.isValid()) {
        return "Invalid date";
    }
    return date.format('YYYY-MM-DD');
};


export { formatDate };