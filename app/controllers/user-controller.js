const User = require('../db/models/user');


class UserController {

    async showUsers (req, res) {
        const { q, sort, agemin, agemax } = req.query;
        const page = req.query.page || 1;
        const perPage = 2;

        //search
        const where= {};
        if (q) {
            where.name = { $regex: q || '', $options: 'i'};
        }

        //filters
        if(agemin || agemax) {
            where.age = {};
            if (agemin) where.age.$gte = agemin;
            if (agemax) where.age.$lte = agemax;
        }
        let query = User.find(where);

        //pagination
        query = query.skip((page - 1) * perPage);
        query = query.limit(perPage);
        const resultsCount = await User.find(where).count();
        const pagesCount = Math.ceil(resultsCount / perPage);

        //sorting
        if (sort) {
            const s = sort.split('|');
            query = query.sort({ [s[0]]: s[1] });
        }

        //exec
        const users = await query.exec();

        res.render('pages/users/users', { 
            users: users,
            page,
            resultsCount,
            pagesCount,
            title: 'Użytkownicy',
        });
    
    }

    async showUser (req, res) {
        const { id, mode } = req.params;
        const user = await User.findOne({_id: id});
        let html;
        
        if(!user) {          
            html = 'Nie ma takiego usera';           
        } else {
            html = (`Dane uzytkownika: imie "${user.name}"`);
            
            if (mode && mode === 'szczegoly'){
                html +=` id "${user.id}", email "${user.email}", wiek "${user.age}"`;
            } else if (mode && mode != 'szczegoly') {
                html = `Brak podstrony /${mode}`;
            }
        }
        res.render('pages/users/user', { 
            html: html,
            title: user?.name ?? 'Brak uzytkownika',
        });
    }

    showCreateUser (req, res) {
        res.render('pages/users/create');
    }

    async createUser (req, res) {
        console.log(req.body);

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            age: req.body.age
        })

        try {
        await user.save();
            res.redirect('/uzytkownicy');
        } catch (err) {
            res.render('pages/users/create', {
                errors: err.errors,
                form: req.body
            });
        }
    }

    async showEditUser (req, res) {
        const { id } = req.params;
        const user = await User.findOne({_id: id});

        res.render('pages/users/edit', {
            form: user
        });
    }

    async editUser (req, res) {
        console.log(req.body);

        const { id } = req.params;
        const user = await User.findOne({_id: id});

        user.name = req.body.name;
        user.email = req.body.email;
        user.age = req.body.age;

        try {
            await user.save();
            res.redirect('/uzytkownicy');
        } catch (err) {
            res.render('pages/users/edit', {
                errors: err.errors,
                form: req.body
            });
        }
    }

    async deleteUser (req, res) {
        const { id } = req.params;

        try {
            await User.deleteOne({_id: id});
            res.redirect('/uzytkownicy');
        } catch (err) {
            console.log(err);
        }
    }

}

module.exports = new UserController();