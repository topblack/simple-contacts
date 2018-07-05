import * as React from 'react';
import { Button, Col, Form, FormGroup, Input, InputGroup, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';

import 'bootstrap/dist/css/bootstrap.min.css';

import ContactCardList from './ContactCardList';
import IAlumniInfo from './model/IAlumniInfo';

interface IStats {
  name: string;
  count: number;
}

interface IBrowseMode {
  mode: string;
}

interface IAppState {
  allAlumnies: IAlumniInfo[];
  cityStats: IStats[];
  industryStats: IStats[];
  filterIncludeIdName: string;
  filterIncludeCity: string;
  filterIncludeIndustry: string;
  cityDropdownOpen: boolean;
  industryDropdownOpen: boolean;
  showCheckinDialog: boolean;
  checkedInName: string;
}

export default class App extends React.Component<IBrowseMode, IAppState> {

  private ALL_CITIES = '所有城市';

  private ALL_INDUSTRIES = '所有领域';

  private SERVICE_URL = 'https://wx1.qinling.net.cn/cose2018/api';

  private checkInId: string;

  private checkInName: string;

  constructor(object: IBrowseMode) {
    super(object);
    this.state = {
      allAlumnies: [] as IAlumniInfo[],
      checkedInName: '',
      cityDropdownOpen: false,
      cityStats: [] as IStats[],
      filterIncludeCity: '',
      filterIncludeIdName: '',
      filterIncludeIndustry: '',
      industryDropdownOpen: false,
      industryStats: [] as IStats[],
      showCheckinDialog: false
    };
  }

  public componentDidMount() {
    if (this.props.mode === 'browsemode' || this.props.mode === 'supermode') {
      fetch(`${this.SERVICE_URL}/allcontacts`)
        .then(res => res.json())
        .then(data => {
          fetch(`${this.SERVICE_URL}/allstatus`)
            .then(res2 => res2.json())
            .then(data2 => {
              for (const record of data.records) {
                for (const statusInfo of data2) {
                  if (statusInfo.id === record.studentId) {
                    // tslint:disable-next-line:no-console
                    console.info(statusInfo.id);
                    record.status = statusInfo.status;
                    break;
                  }
                }
              }

              this.setState({ allAlumnies: data.records, cityStats: data.summary.cities, industryStats: data.summary.industries });
            }).catch(error => window.alert(error));
        }).catch(error => window.alert(error));
    }
  }

  public render() {
    if (this.props.mode === 'browsemode' || this.props.mode === 'supermode') {
      return this.renderBrowseView();
    } else {
      return this.renderCheckinView();
    }
  }

  private renderCheckinView() {
    let actionDisplay: string = '';
    if (this.props.mode === 'welcometeacher') {
      actionDisplay = '老师，请进入';
    } else {
      actionDisplay = '同学，请签到'
    }
    return (
      <div className="container-fluid">
        <Row className="header">
          <Col xl="1" lg="2" md="2" sm="4" xs="4">
            <img src="images/logo.png" width="100%" />
          </Col>
          <Col xl="11" lg="10" md="10" sm="8" xs="8">
            &#60;CoSE/&#62;
        </Col>
        </Row>
        <Row>
          <div className="container text-center welcomeTitle">
            软件学院2008届本科毕业10周年聚会
            </div>
        </Row>
        <Row>
        <div className="container text-center welcomeTitle">
        <img src="images/theme.jpg" />
            </div>
        </Row>
        <Row>
          <div className="container text-center welcomeSubTitle">
            {'/* 十全十美 因为有你 止于至善 */'}
          </div>
        </Row>
        <Row>
          <div className="container text-center welcomeTitle"><Button outline={true} color="primary" size="lg" onClick={this.toggleCheckinForm} disabled={this.state.checkedInName.length > 0}>{this.state.checkedInName.length > 0 ? this.state.checkedInName + ', 欢迎到来' : actionDisplay}</Button>
            <Modal isOpen={this.state.showCheckinDialog} toggle={this.toggleCheckinForm}>
              <ModalHeader toggle={this.toggleCheckinForm}>{actionDisplay}</ModalHeader>
              <ModalBody>
                <Form>
                  <FormGroup>
                    <Label for="studentIdInput">学号</Label>
                    <Input id="studentIdInput" bsSize="lg" onChange={this.handleStudentIdInputChanged} />
                  </FormGroup>
                  <FormGroup>
                    <Label for="nameInput">姓名</Label>
                    <Input id="nameInput" bsSize="lg" onChange={this.handleNameInputChanged} />
                  </FormGroup>
                </Form>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={this.submitCheckinForm}>提交</Button>{' '}
                <Button color="secondary" onClick={this.toggleCheckinForm}>取消</Button>
              </ModalFooter>
            </Modal></div>
        </Row>
      </div>
    );
  }

  private handleStudentIdInputChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.checkInId = e.target.value;
  }

  private handleNameInputChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.checkInName = e.target.value;
  }

  private submitCheckinForm = () => {

    fetch(`${this.SERVICE_URL}/status/`, {
      body: JSON.stringify({
        id: this.checkInId,
        name: this.checkInName,
        status: '已到'
      }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST'
    }
    ).then(() => {
      this.toggleCheckinForm();
      this.setState({ checkedInName: this.checkInName });
    }).catch(error => {
      window.alert('签到失败. 请使用登记聚会意向时所填写的对应的学号，姓名签到。');
    });
  }

  private toggleCheckinForm = () => {
    if (this.props.mode === 'welcometeacher') {
      window.location.href = '?mode=browsemode';
      return;
    }

    this.setState({
      showCheckinDialog: !this.state.showCheckinDialog
    });
  }

  private renderBrowseView() {
    const alumnies = this.filterData();
    const cities = this.state.cityStats;
    const cityItems: any = cities.map((item) => <option key={item.name}>{item.name} ({item.count})</option>);

    const industries = this.state.industryStats;
    const industryItems: any = industries.map((item) => <option key={item.name}>{item.name} ({item.count})</option>);

    return (
      <div className="container-fluid">
        <Row className="header">
          <Col xl="1" lg="2" md="2" sm="4" xs="4">
            <img src="images/logo.png" width="100%" />
          </Col>
          <Col xl="11" lg="10" md="10" sm="8" xs="8">
            &#60;CoSE/&#62;
        </Col>
        </Row>
        <Row>
          <InputGroup>
            <Input placeholder="学号或姓名" onChange={this.handleTextFilterUpdated} />
            <Input type="select" name="select" onChange={this.handleCityFilterUpdated}>
              <option>{this.ALL_CITIES}</option>
              {cityItems}
            </Input>
            <Input type="select" name="select" onChange={this.handleIndustryFilterUpdated}>
              <option>{this.ALL_INDUSTRIES}</option>
              {industryItems}
            </Input>
          </InputGroup>
        </Row>
        <ContactCardList alumnies={alumnies} allowEdit={this.props.mode === 'supermode'} />
      </div>
    );
  }

  private handleCityFilterUpdated = (e: React.ChangeEvent<HTMLInputElement>) => {
    let key = e.target.value;
    if (key === this.ALL_CITIES) {
      key = '';
    }
    this.setState({ filterIncludeCity: key });
  }

  private handleIndustryFilterUpdated = (e: React.ChangeEvent<HTMLInputElement>) => {
    let key = e.target.value;
    if (key === this.ALL_INDUSTRIES) {
      key = '';
    }
    this.setState({ filterIncludeIndustry: key });
  }

  private handleTextFilterUpdated = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ filterIncludeIdName: e.target.value });
  }

  private filterData = () => {
    let filteredData = this.filterByIdName(this.state.allAlumnies);
    filteredData = this.filterByCities(filteredData);
    filteredData = this.filterByIndustries(filteredData);

    return filteredData;
  }

  private filterByIdName = (data: IAlumniInfo[]) => {
    const filterIncludeIdName = this.state.filterIncludeIdName;
    if (filterIncludeIdName.length === 0) {
      return data;
    }

    const filteredData: IAlumniInfo[] = [] as IAlumniInfo[];
    data.forEach(value => {
      if (value.studentId.indexOf(filterIncludeIdName) >= 0 || value.name.indexOf(filterIncludeIdName) >= 0) {
        filteredData.push(value);
      }
    });
    return filteredData;
  }

  private filterByCities = (data: IAlumniInfo[]) => {
    let filterIncludeCity = this.state.filterIncludeCity;
    if (filterIncludeCity.length === 0) {
      return data;
    }

    filterIncludeCity = filterIncludeCity.split(' ')[0];

    const filteredData: IAlumniInfo[] = [] as IAlumniInfo[];
    data.forEach(value => {
      if (value.live.indexOf(filterIncludeCity) >= 0) {
        filteredData.push(value);
      }
    });
    return filteredData;
  }

  private filterByIndustries = (data: IAlumniInfo[]) => {
    let filterIncludeIndustry = this.state.filterIncludeIndustry;
    if (filterIncludeIndustry.length === 0) {
      return data;
    }

    filterIncludeIndustry = filterIncludeIndustry.split(' ')[0];

    const filteredData: IAlumniInfo[] = [] as IAlumniInfo[];
    data.forEach(value => {
      if (value.industry.indexOf(filterIncludeIndustry) >= 0) {
        filteredData.push(value);
      }
    });
    return filteredData;
  }
}