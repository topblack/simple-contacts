import * as React from 'react';
import { Badge, Button, Col, Container, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import IAlumniInfo from './model/IAlumniInfo';

interface IContactCardModel {
  showDetails: boolean;
  checkedIn: boolean;
  status: string;
}

export default class ContactCard extends React.Component<IAlumniInfo, IContactCardModel> {

  private SERVICE_URL = 'https://wx1.qinling.net.cn/cose2018/api';

  private pendingStatus = '';

  constructor(object: any) {
    super(object);
    this.state = {
      checkedIn: false,
      showDetails: false,
      status: this.props.status
    };
  }

  public render() {
    const info = this.props;
    return (
      <div className="ContactCard">
        <Container onClick={this.toggle}>
          <Row>
            <Col>{info.studentId}</Col>
            <Col>{info.name}</Col>
            <Col>{this.statusIndicator()}</Col>
          </Row>
        </Container>
        <Modal isOpen={this.state.showDetails} toggle={this.toggle} className="contactDetailsDialog">
          <ModalHeader toggle={this.toggle}>{info.studentId + ' ' + info.name}</ModalHeader>
          <ModalBody>
            <Container className="contactDetails">
              <Row>
                <Col sm="4"><img src={'/images/' + info.studentId + '.jpg'} /></Col>
                <Col sm="8">
                  <Form>
                    <FormGroup row={true}>
                      <Label for="living" sm={2}>常住地</Label>
                      <Col sm={10}>
                        <Input id="living" value={info.live} readOnly={true} />
                      </Col>
                    </FormGroup>
                    <FormGroup row={true}>
                      <Label for="work" sm={2}>工作单位</Label>
                      <Col sm={10}>
                        <Input id="work" value={info.work} readOnly={true} />
                      </Col>
                    </FormGroup>
                    <FormGroup row={true}>
                      <Label for="industry" sm={2}>所属行业</Label>
                      <Col sm={10}>
                        <Input id="industry" value={info.industry} readOnly={true} />
                      </Col>
                    </FormGroup>
                    <FormGroup row={true}>
                      <Label for="mobile" sm={2}>手机号码</Label>
                      <Col sm={10}>
                        <Input id="mobile" value={info.mobile} readOnly={true} />
                      </Col>
                    </FormGroup>
                    <FormGroup row={true}>
                      <Label for="email" sm={2}>个人邮箱</Label>
                      <Col sm={10}>
                        <Input id="email" value={info.email} readOnly={true} />
                      </Col>
                    </FormGroup>
                    <FormGroup row={true}>
                      <Label for="others" sm={2}>其他</Label>
                      <Col sm={10}>
                        <Input id="others" value={info.others} readOnly={true} />
                      </Col>
                    </FormGroup>
                    {this.props.allowEdit ?
                      <FormGroup row={true}>
                        <Label for="mark" sm={2}>标记</Label>
                        <Col sm={10}>
                          <Input type="select" id="markStatus" onChange={this.handleStatusMarkUpdated} >
                            <option>未指定</option>
                            <option>已到</option>
                            <option>未签到</option>
                            <option>不参加</option>
                            <option>失联</option>
                          </Input>
                        </Col>
                      </FormGroup> : null
                    }
                  </Form>
                </Col>
              </Row>
            </Container>
          </ModalBody>
          <ModalFooter>
          {this.props.allowEdit ? <Button color="primary" onClick={this.update}>更新</Button> : null }
            {' '}<Button color="secondary" onClick={this.toggle}>关闭</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }

  private handleStatusMarkUpdated = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.pendingStatus = e.target.value;
  }

  private statusIndicator = () => {
    let color: string = 'light';
    if (this.state.status === '已到') {
      color = 'success';
    } else if (this.state.status === '未签到') {
      color = 'primary';
    } else if (this.state.status === '不参加') {
      color = 'secondary';
    } else {
      color = 'light';
    }
    return (<Badge color={color}>{this.state.status}</Badge>);
  }

  private update = () => {
    fetch(`${this.SERVICE_URL}/status/`, {
      body: JSON.stringify({
        id: this.props.studentId,
        name: this.props.name,
        status: this.pendingStatus
      }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST'
    }
    ).then(() => {
      this.setState({ status: this.pendingStatus, showDetails: false });
    }).catch(error => {
      window.alert('状态变更失败。');
    });
  }

  private toggle = () => {
    this.setState({ showDetails: !this.state.showDetails });
  }
}