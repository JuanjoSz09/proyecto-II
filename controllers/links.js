const {
  createLink,
  getAllLinks,
  getLinkById,
  deteleLinkById,
} = require('../db/links');
const { generateError, createPathIfNotExists } = require('../helpers');
const path = require('path');
const sharp = require('sharp');
const { nanoid } = require('nanoid');

const getLinksController = async (req, res, next) => {
  try {
    const links = await getAllLinks();

    res.send({
      status: 'ok',
      data: links,
    });
  } catch (error) {
    next(error);
  }
};

const newLinkController = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (req.files && req.files.image) {
      
      const uploadsDir = path.join(__dirname, '../uploads');

      
      await createPathIfNotExists(uploadsDir);

      
      const image = sharp(req.files.image.data);
      image.resize(1000);

      
      imageFileName = `${nanoid(24)}.jpg`;

      await image.toFile(path.join(uploadsDir, imageFileName));
    }

    const id = await createLink(req.userId, text, imageFileName);

    res.send({
      status: 'ok',
      message: `Link con id: ${id} creado correctamente`,
    });
  } catch (error) {
    next(error);
  }
};

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

const deleteLinkController = async (req, res, next) => {
  try {
    
    const { id } = req.params;

    
    const link = await getLinkById(id);

    
    if (req.userId !== link.user_id) {
      throw generateError(
        'ese link no es tuyo',
        401
      );
    }

    
    await deteleLinkById(id);

    res.send({
      status: 'ok',
      message: `El link con id: ${id} fue eliminado`,
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
