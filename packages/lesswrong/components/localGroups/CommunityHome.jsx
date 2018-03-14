import { Components, registerComponent, withCurrentUser, getFragment, withMessages } from 'meteor/vulcan:core';
import React, { Component } from 'react';
import { Localgroups } from '../../lib/index.js';
import Dialog from 'material-ui/Dialog';
import { Link, withRouter } from 'react-router';

class CommunityHome extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      newGroupFormOpen: false,
      newEventFormOpen: false,
      currentUserLocation: {lat: 37.871853, lng: -122.258423},
    }
  }

  componentDidMount() {
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.setState({
          currentUserLocation: {lat: position.coords.latitude, lng: position.coords.longitude}
        })
      });
    }
  }

  handleOpenNewGroupForm = () => {
    this.setState({
      newGroupFormOpen: true,
    })
  }

  handleCloseNewGroupForm = () => {
    this.setState({
      newGroupFormOpen: false,
    })
  }

  handleOpenNewEventForm = () => {
    this.setState({
      newEventFormOpen: true,
    })
  }

  handleCloseNewEventForm = () => {
    this.setState({
      newEventFormOpen: false,
    })
  }

  renderNewGroupForm = () => {
    if (this.props.currentUser) {
      return (<div>
        <a onClick={this.handleOpenNewGroupForm}>Create new group</a>
        <Dialog
          contentStyle={{maxWidth:"400px"}}
          title="New Local Group Form"
          open={this.state.newGroupFormOpen}
          onRequestClose={this.handleCloseNewGroupForm}
          className="comments-item-text local-group-new-form"
          bodyClassName="local-group-new-form-body"
          autoScrollBodyContent
        >
          <Components.SmartForm
            collection={Localgroups}
            mutationFragment={getFragment('localGroupsHomeFragment')}
            prefilledProps={{organizerIds: [this.props.currentUser._id]}}
            successCallback={localGroup => {
              this.handleCloseNewGroupForm();
              this.props.flash("Successfully created new local group " + localGroup.name);
              this.props.router.push({pathname: '/groups/' + localGroup._id});
            }}
          />
        </Dialog>
      </div>)
    }
  }

  render() {
    const router = this.props.router;
    const postsListTerms = {
      view: 'nearbyEvents',
      lat: this.state.currentUserLocation.lat,
      lng: this.state.currentUserLocation.lng,
      limit: 5,
      filters: router.location.query && router.location.query.filters || [],
    }
    const groupsListTerms = {
      view: 'nearby',
      lat: this.state.currentUserLocation.lat,
      lng: this.state.currentUserLocation.lng,
      limit: 3,
      filters: router.location.query && router.location.query.filters || [],
    }
    const mapEventTerms = {
      view: 'nearbyEvents',
      lat: this.state.currentUserLocation.lat,
      lng: this.state.currentUserLocation.lng,
      filters: router.location.query && router.location.query.filters || [],
    }
    return (
      <div className="community-home">
        <Components.CommunityMapWrapper
          terms={mapEventTerms}
        />
        <Components.Section title="Local Groups" titleComponent={<div>
          {this.props.currentUser && <div className="local-groups-menu"><Components.GroupFormLink /></div>}
          {this.props.currentUser && <div><Link className="local-groups-menu" to={{pathname:"/newPost", query: {eventForm: true}}}> Create new event </Link></div>}
        </div>}>
          {this.state.currentUserLocation &&
            <div>
              <Components.LocalGroupsList
                terms={groupsListTerms}
                showHeader={false} />
              <hr className="community-home-list-divider"/>
              <Components.PostsList
                terms={postsListTerms}
                showHeader={false} />
            </div>}
        </Components.Section>
        <Components.Section title="Resources">
          <Components.PostsList terms={{view: 'communityResourcePosts'}} showHeader={false} />
        </Components.Section>
      </div>
    )
  }
}

registerComponent('CommunityHome', CommunityHome, withCurrentUser, withMessages, withRouter);