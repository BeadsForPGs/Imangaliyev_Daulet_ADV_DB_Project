const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const personSchema = new mongoose.Schema({
    firstname: String,
    surname: String,
    telephone: String,
    grades: {
        Midterm: Number,
        Endterm: Number,
        Final: Number,
        total: {
            type: Number,
            get: function() {
                return 0.3*this.Midterm + 0.3*this.Endterm + 0.4*this.Final;
            }
        }
    },
    password: String,
});

personSchema.pre('save', function(next) {
    const person = this;

    // only hash the password if it has been modified (or is new)
    if (!person.isModified('password')) {
        return next();
    }

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) {
            return next(err);
        }

        // hash the password using the generated salt
        bcrypt.hash(person.password, salt, function(err, hash) {
            if (err) {
                return next(err);
            }

            // override the cleartext password with the hashed one
            person.password = hash;
            next();
        });
    });
});

const Person = mongoose.model('Person', personSchema);

module.exports = Person;
