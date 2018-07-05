import * as React from 'react';

import ContactCard from './ContactCard';

import { ListGroup, ListGroupItem } from 'reactstrap';
import IAlumniInfo from './model/IAlumniInfo';

interface IContactCardListProps {
    alumnies: IAlumniInfo[];
    allowEdit: boolean;
}

export default class ContactCardList extends React.Component<IContactCardListProps, object> {

    public render() {
        const listItems: any = this.props.alumnies.map((item) =>
            <ListGroupItem key={item.studentId} tag="a" href="#">
                <ContactCard 
                    studentId={item.studentId}
                    name={item.name}
                    live={item.live}
                    work={item.work}
                    industry={item.industry}
                    mobile={item.mobile}
                    email={item.email}
                    status={item.status}
                    others={item.others}
                    allowEdit={this.props.allowEdit}/>
            </ListGroupItem>
        );

        return (
            <ListGroup>{listItems}</ListGroup>
        );
    }
}