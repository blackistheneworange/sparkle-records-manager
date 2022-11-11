import React from 'react';
import {Link} from 'react-router-dom';
import { Header, Icon } from 'semantic-ui-react';

const HeaderComponent = () => (
    <header>
        <Header as='h2' dividing style={{padding:'1em'}}>
            <div className='pageTitle'>
                <Link to="/" className='pageTitle'>
                    <Icon name='book' size='large' style={{color:'#313131'}} />
                    <Header.Content>
                        Sparkle Records System
                        <Header.Subheader>Manage records on the go</Header.Subheader>
                    </Header.Content>
                </Link>
            </div>
        </Header>
    </header>
)

export default HeaderComponent;