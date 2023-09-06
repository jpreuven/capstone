"""added base

Revision ID: 298f6aa1304a
Revises: ccfa8a25f0d5
Create Date: 2023-09-04 23:46:33.616187

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '298f6aa1304a'
down_revision = 'ccfa8a25f0d5'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('leases', schema=None) as batch_op:
        batch_op.add_column(sa.Column('property_id', sa.Integer(), nullable=True))
        batch_op.create_foreign_key(batch_op.f('fk_leases_property_id_properties'), 'properties', ['property_id'], ['id'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('leases', schema=None) as batch_op:
        batch_op.drop_constraint(batch_op.f('fk_leases_property_id_properties'), type_='foreignkey')
        batch_op.drop_column('property_id')

    # ### end Alembic commands ###
