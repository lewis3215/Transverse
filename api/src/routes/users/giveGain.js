const {User,Annonce, Accepter} = require('../../db/sequelize')

module.exports = (app) => {
    app.put('/api/users/paie/:idAnnonce', (req, res) => {
        Accepter.findOne({ where: { annonceId: req.params.idAnnonce }
        })
        .then(toPaie => {
            if (toPaie) {
                User.findOne({ where: { id: toPaie.userId } })
                .then(user => {
                    Annonce.findOne({ where: { id: toPaie.annonceId } })
                    .then(annonce => {
                        const newCredit = user.credit + annonce.credit
                        User.update({ credit: newCredit }, { where: { id: user.id } })
                        .then(() => {
                            Annonce.update({ accepter: 1 }, { where: { id: annonce.id } })
                            Accepter.update({ terminate: 1 }, { where: { userId: user.id, annonceId: annonce.id } })
                            User.findByPk(user.id).then(User => {
                                res.json(User)
                              })
                         })
                        .catch(err => res.status(404).json({ error: err }))
                    })
                })

            }
        })
        .catch(err => res.status(500).json(err)) 
})
}