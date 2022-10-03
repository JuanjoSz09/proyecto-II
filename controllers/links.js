const {
  createLink,
  getAllLinks,
  getLinkById,
  deteleLinkById,
} = require('../db/links');

const { generateError } = require('../helpers');

/**
 * ########################
 * ## getLinksController ##
 * ########################
 */

const getLinksController = async (req, res, next) => {
  try {
    const links = await getAllLinks();

    res.send({
      status: 'ok',
      data: {
        links,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ########################
 * ## newLinkController ##
 * ########################
 */

const newLinkController = async (req, res, next) => {
  try {
    const { title, description, url } = req.body;

    if (!title || !description || !url) {
      throw generateError('title, description y url necesario', 400);
    }

    const id = await createLink(title, description, url, req.userId);

    res.send({
      status: 'ok',
      message: `Link con id: ${id} creado correctamente`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ########################
 * ## getSingleLinkController ##
 * ########################
 */

const getSingleLinkController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const link = await getLinkById(id);

    res.send({
      status: 'ok',
      data: link,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ########################
 * ## deleteLinkController ##
 * ########################
 */

const deleteLinkController = async (req, res, next) => {
  try {
    const { idLink } = req.params;

    const link = await getLinkById(idLink);

    if (req.userId !== link.idUser) {
      throw generateError('ese link no es tuyo', 401);
    }

    await deteleLinkById(idLink);

    res.send({
      status: 'ok',
      message: `El link con id: ${idLink} fue eliminado`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLinksController,
  newLinkController,
  getSingleLinkController,
  deleteLinkController,
};
