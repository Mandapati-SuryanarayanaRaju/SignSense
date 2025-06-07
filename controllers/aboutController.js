exports.getAboutPage = (req, res) => {
    res.render('about', { user: req.session.user || null });
};
