import { Components, registerComponent, withCurrentUser} from 'meteor/vulcan:core';
import React from 'react';
import { Link } from 'react-router';
import { withStyles } from '@material-ui/core/styles';

const testCollections = [
  {
    title: "Rationality: A-Z",
    id: "dummyId",
    user: {userName: "Eliezer_Yudkowsky", displayName: "EliezerYudkowsky", slug: "eliezer_yudkowsky"},
    summary: 'A set of essays by Eliezer Yudkowsky that serve as a long-form introduction to formative ideas behind Less Wrong, the Machine Intelligence Research Institute, the Center for Applied Rationality, and substantial parts of the effective altruism community.',
    imageId: "dVXiZtw_xrmvpm.png",
    color: "#B1D4B4",
    big: true,
  },
  {
    title: "The Codex",
    id: "dummyId2",
    user: {username: "Yvain", displayName: "Scott Alexander", slug: "yvain"},
    summary: "The Codex contains essays about science, medicine, philosophy, politics, and futurism. (There’s also one post about hallucinatory cactus-people, but it’s not representative)",
    imageId: "ItFKgn4_rrr58y.png",
    color: "#88ACB8",
    big: false,
  },
  {
    title: "Harry Potter and the Methods of Rationality",
    id: "dummyId3",
    user: {userName: "Eliezer_Yudkowsky", displayName: "EliezerYudkowsky", slug: "eliezer_yudkowsky"},
    summary: "In an Alternate Universe, Petunia married a scientist. Now Rationalist!Harry enters the wizarding world armed with Enlightenment ideals and the experimental spirit.",
    imageId: "uu4fJ5R_zeefim.png",
    color: "#757AA7",
    big: false,
  }
]

const styles = theme => ({
    root: {
      [theme.breakpoints.up('md')]: {
        marginRight: 90,
      },
      [theme.breakpoints.down('sm')]: {
        marginRight: 0
      }
    }
})

const Home = (props, context) => {
  const { currentUser, router, classes } = props;
  const currentView = _.clone(router.location.query).view || (currentUser && currentUser.currentFrontpageFilter) || (currentUser ? "frontpage" : "curated");
  let recentPostsTerms = _.isEmpty(router.location.query) ? {view: currentView, limit: 10} : _.clone(router.location.query)
  if (recentPostsTerms.view === "curated" && currentUser) {
    recentPostsTerms.offset = 3
  }

  const curatedPostsTerms = {view:"curated", limit:3}
  let recentPostsTitle = "Recent Posts"
  switch (recentPostsTerms.view) {
    case "frontpage":
      recentPostsTitle = "Frontpage Posts"; break;
    case "curated":
      if (currentUser) {
        recentPostsTitle = "More Curated"; break;
      } else {
        recentPostsTitle = "Curated Posts"; break;
      }
    case "community":
      recentPostsTitle = "All Posts"; break;
    default:
      return "Recent Posts";
  }

  const lat = currentUser && currentUser.mongoLocation && currentUser.mongoLocation.coordinates[1]
  const lng = currentUser && currentUser.mongoLocation && currentUser.mongoLocation.coordinates[0]
  let eventsListTerms = {
    view: 'events',
    limit: 3,
  }
  if (lat && lng) {
    eventsListTerms = {
      view: 'nearbyEvents',
      lat: lat,
      lng: lng,
      limit: 3,
    }
  }

  return (
    <div className={classes.root}>
      { !currentUser ?
        <Components.Section
          contentStyle={{marginTop: '-20px'}}
          title="Recommended Reading"
          titleLink="/library"
          titleComponent= {<Link className="recommended-reading-library" to="/library">Sequence Library</Link>}
        >
          <Components.CollectionsCard collection={testCollections[0]} big={true} url={"/rationality"}/>
          <Components.CollectionsCard collection={testCollections[1]} float={"left"} url={"/codex"}/>
          <Components.CollectionsCard collection={testCollections[2]} float={"right"} url={"/hpmor"}/>
        </Components.Section> :
        <div>
          <Components.Section
            title="Recommended Sequences"
            titleLink="/library"
            titleComponent= {<Link className="recommended-reading-library" to="/library">Sequence Library</Link>}
          >
            <Components.SequencesGridWrapper
              terms={{view:"curatedSequences", limit:3}}
              showAuthor={true}
              showLoadMore={false}
            className="frontpage-sequences-grid-list" />
          </Components.Section>
          <Components.Section title="Curated Content">
            <Components.PostsList terms={curatedPostsTerms} showHeader={false} showLoadMore={false}/>
          </Components.Section>
        </div>}
      <Components.Section title={recentPostsTitle}
        titleComponent= {<div className="recent-posts-title-component">
          <Components.PostsViews />
        </div>} >
        <Components.PostsList terms={recentPostsTerms} showHeader={false} />
      </Components.Section>
      <Components.Section
        title="Community"
        titleLink="/community"
        titleComponent={<div>
          <Link className="events-near-you" to="/community">
            Find Events Nearby
          </Link>
        </div>}
      >
        <Components.PostsList
          terms={eventsListTerms}
          showLoadMore={false}
          showHeader={false} />
      </Components.Section>
      <Components.Section title="Recent Discussion" titleLink="/AllComments">
        <Components.RecentDiscussionThreadsList terms={{view: 'recentDiscussionThreadsList', limit:6}}/>
      </Components.Section>
    </div>
  )
};

registerComponent('Home', Home, withCurrentUser, withStyles(styles));
