import React, { PropTypes } from 'react/addons';

class UsersList extends React.Component {
  render() {
    const props = this.props;
    return (
      <View>
        {props.withMoreUsersNavigation ?
          (
            <Link to={props.withMoreUsersNavigation.route} >
              <AppText>
                <FormatMessage>View More People</FormatMessage>
              </AppText>
            </Link>
          ) :
          null
        }
      </View>
    );
  }
}

export default UsersList;
