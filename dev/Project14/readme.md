# test tool
https://chromewebstore.google.com/detail/altair-graphql-client/flnheeellpciglgpaodhkhmapeljopja?pli=1

# Query 
    {
        hello
        signup(username: "han", password: "han") {
            token
            user {
                id
                username
            }
        }
        me {
            id
            username
        }
        add_car(id: 23) {
            id
        }
    }
# Auth
將signup得到的token放進Bearer Token